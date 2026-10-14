import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LIVE_REVIEW, LIVE_REVIEWED_STORE, LIVE_REVIEWER } from '../testing/live-review-fixture';
import { ReviewHttpRepository } from './review-http.repository';

const BASE_URL = 'https://api.test';
const REVIEWS_URL = `${BASE_URL}/admin/reviews`;
const FIVE_STARS = { ...LIVE_REVIEW, id: 8, rating: 5 };

describe('ReviewHttpRepository', () => {
  let repository: ReviewHttpRepository;
  let http: HttpTestingController;

  function answerPage(page: number, rows: readonly unknown[], lastPage: number): void {
    const request = http.expectOne(
      (candidate) => candidate.url === REVIEWS_URL && candidate.params.get('page') === String(page),
    );
    request.flush({ data: rows, current_page: page, last_page: lastPage, total: 2 });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(ReviewHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('walks every server page, then filters and pages the reviews here', async () => {
    const response = firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 10, rating: 'fiveStars' }),
    );

    answerPage(1, [LIVE_REVIEW], 2);
    answerPage(2, [FIVE_STARS], 2);

    const page = await response;
    expect(page.totalCount).toBe(1);
    expect(page.items[0].id).toBe('8');
  });

  it('reads the summary from the server', async () => {
    const response = firstValueFrom(repository.getSummary());

    http.expectOne(`${REVIEWS_URL}/summary`).flush({
      total_reviews: 3,
      average_rating: 4,
      new_reviews: 2,
      reported_reviews: 1,
    });

    expect(await response).toEqual({
      totalCount: 3,
      averageRating: 4,
      newCount: 2,
      reportedCount: 1,
    });
  });

  it("reads one review with its writer, its place and the writer's other reviews", async () => {
    const response = firstValueFrom(repository.getReviewDetail('7'));

    http.expectOne(`${REVIEWS_URL}/7`).flush(LIVE_REVIEW);
    http.expectOne(`${BASE_URL}/admin/users/16`).flush({ data: LIVE_REVIEWER });
    http.expectOne(`${BASE_URL}/admin/stores/18`).flush({ data: LIVE_REVIEWED_STORE });
    answerPage(1, [LIVE_REVIEW, FIVE_STARS], 1);

    const detail = await response;
    expect(detail.reviewer.reviewCount).toBe(2);
    expect(detail.place.areaName).toBe('المزة');
  });

  it('hides a review with PATCH and reads it again', async () => {
    const response = firstValueFrom(repository.setReviewStatus('7', 'hidden'));

    const request = http.expectOne({ method: 'PATCH', url: `${REVIEWS_URL}/7/status` });
    expect(request.request.body).toEqual({ status: 'hidden' });
    request.flush({ review: {} });
    http.expectOne(`${REVIEWS_URL}/7`).flush({ ...LIVE_REVIEW, status: 'hidden' });

    expect((await response).status).toBe('hidden');
  });

  it('settles a report with the admin note the server requires', async () => {
    const response = firstValueFrom(repository.acceptReport('7'));

    const request = http.expectOne({ method: 'POST', url: `${REVIEWS_URL}/7/report/accept` });
    expect(request.request.body.admin_notes).toBeTruthy();
    request.flush({});
    http.expectOne(`${REVIEWS_URL}/7`).flush(LIVE_REVIEW);

    expect((await response).id).toBe('7');
  });

  it('deletes a review', async () => {
    const response = firstValueFrom(repository.deleteReview('7'));

    http.expectOne({ method: 'DELETE', url: `${REVIEWS_URL}/7` }).flush({});

    expect(await response).toBeUndefined();
  });

  it('builds the export file here, with the table columns and filters', async () => {
    const response = firstValueFrom(repository.exportReviews({ pageIndex: 0, pageSize: 10 }));
    answerPage(1, [LIVE_REVIEW], 1);

    expect((await response).type).toContain('text/csv');
  });
});
