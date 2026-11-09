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

  it('asks the server for one page and shows it as it comes', async () => {
    const response = firstValueFrom(
      repository.getReviews({ pageIndex: 2, pageSize: 4, rating: 'fiveStars' }),
    );

    const request = http.expectOne((candidate) => candidate.url === REVIEWS_URL);
    expect(request.request.params.get('page')).toBe('3');
    expect(request.request.params.get('per_page')).toBe('4');
    request.flush({ data: [LIVE_REVIEW, FIVE_STARS], current_page: 3, last_page: 5, total: 18 });

    const page = await response;
    expect(page.totalCount).toBe(18);
    expect(page.items.map((review) => review.id)).toEqual([String(LIVE_REVIEW.id), '8']);
  });

  it('sends every picked filter', () => {
    repository
      .getReviews({
        pageIndex: 0,
        pageSize: 10,
        rating: 'threeStars',
        status: 'hidden',
        sort: 'newest',
      })
      .subscribe();

    const request = http.expectOne((candidate) => candidate.url === REVIEWS_URL);
    expect(request.request.params.get('rating')).toBe('3');
    expect(request.request.params.get('status')).toBe('hidden');
    expect(request.request.params.get('sort_by')).toBe('latest');
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('per_page')).toBe('10');
    request.flush({ data: [], current_page: 1, last_page: 1, total: 0 });
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

  it('reads one review with its writer, whose review count comes from the user route', async () => {
    const response = firstValueFrom(repository.getReviewDetail('7'));

    http.expectOne(`${REVIEWS_URL}/7`).flush(LIVE_REVIEW);
    http.expectOne(`${BASE_URL}/admin/users/16`).flush({ data: LIVE_REVIEWER });
    http.expectOne(`${BASE_URL}/admin/stores/18`).flush({ data: LIVE_REVIEWED_STORE });

    const detail = await response;
    expect(detail.reviewer.reviewCount).toBe(4);
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

  it('downloads the export file from the server, with the table filters', async () => {
    const file = new Blob(['ID'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportReviews({ pageIndex: 0, pageSize: 10, rating: 'fiveStars', search: 'جيد' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${REVIEWS_URL}/export`);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('rating')).toBe('5');
    expect(request.request.params.get('search')).toBe('جيد');
    request.flush(file);

    expect(await response).toBe(file);
  });
});
