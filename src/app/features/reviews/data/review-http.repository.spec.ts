import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildReview, buildReviewDetail } from '../testing/review-fixture';
import { ReviewHttpRepository } from './review-http.repository';

const BASE_URL = 'https://api.test';

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

  it('asks for a page of reviews with the filters', async () => {
    const page = { items: [buildReview()], totalCount: 1 };
    const response = firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 4, rating: 'unrated' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/reviews`);
    expect(request.request.params.get('rating')).toBe('unrated');
    request.flush(page);
    expect(await response).toEqual(page);
  });

  it('reads the summary and one review in detail', async () => {
    const summary = { totalCount: 3000, averageRating: 4.3, newCount: 14, reportedCount: 4 };
    const detail = buildReviewDetail();
    const summaryResponse = firstValueFrom(repository.getSummary());
    const detailResponse = firstValueFrom(repository.getReviewDetail('review-2'));

    http.expectOne(`${BASE_URL}/reviews/summary`).flush(summary);
    http.expectOne(`${BASE_URL}/reviews/review-2`).flush(detail);

    expect(await summaryResponse).toEqual(summary);
    expect(await detailResponse).toEqual(detail);
  });

  it('accepts and rejects a report with a POST each', async () => {
    const accepted = firstValueFrom(repository.acceptReport('review-2'));
    const rejected = firstValueFrom(repository.rejectReport('review-3'));

    const accept = http.expectOne(`${BASE_URL}/reviews/review-2/report/accept`);
    expect(accept.request.method).toBe('POST');
    accept.flush(buildReview({ status: 'hidden' }));
    const reject = http.expectOne(`${BASE_URL}/reviews/review-3/report/reject`);
    expect(reject.request.method).toBe('POST');
    reject.flush(buildReview({ status: 'published' }));

    expect((await accepted).status).toBe('hidden');
    expect((await rejected).status).toBe('published');
  });

  it('changes the status with a PATCH and deletes with a DELETE', async () => {
    const statusResponse = firstValueFrom(repository.setReviewStatus('review-1', 'hidden'));
    const deleteResponse = firstValueFrom(repository.deleteReview('review-1'), {
      defaultValue: undefined,
    });

    const patch = http.expectOne(`${BASE_URL}/reviews/review-1/status`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ status: 'hidden' });
    patch.flush(buildReview({ status: 'hidden' }));
    const remove = http.expectOne(`${BASE_URL}/reviews/review-1`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);

    expect((await statusResponse).status).toBe('hidden');
    await deleteResponse;
  });

  it('downloads the export as a file with the same filters', async () => {
    const file = new Blob(['csv'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportReviews({ pageIndex: 0, pageSize: 4, status: 'hidden' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/reviews/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('status')).toBe('hidden');
    request.flush(file);
    expect(await response).toBe(file);
  });
});
