import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildOwnerReview, buildOwnerReviewSummary } from '../testing/owner-review-fixture';
import { OwnerReviewsHttpRepository } from './owner-reviews-http.repository';

const BASE_URL = 'https://api.test';

describe('OwnerReviewsHttpRepository', () => {
  let repository: OwnerReviewsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnerReviewsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(OwnerReviewsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of reviews with only the filters that are set', async () => {
    const page = { items: [buildOwnerReview()], totalCount: 1 };
    const response = firstValueFrom(
      repository.getReviews({
        pageIndex: 2,
        pageSize: 4,
        search: 'أحمد',
        rating: 5,
        reportStatus: 'pending',
        submittedFrom: '2026-09-01',
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/owner/reviews`);
    const params = request.request.params;
    expect(params.get('pageIndex')).toBe('2');
    expect(params.get('pageSize')).toBe('4');
    expect(params.get('search')).toBe('أحمد');
    expect(params.get('rating')).toBe('5');
    expect(params.get('reportStatus')).toBe('pending');
    expect(params.get('submittedFrom')).toBe('2026-09-01');
    expect(params.has('submittedTo')).toBe(false);
    expect(params.has('sort')).toBe(false);
    request.flush(page);
    expect(await response).toEqual(page);
  });

  it('reads the rating summary', async () => {
    const summary = buildOwnerReviewSummary();
    const response = firstValueFrom(repository.getSummary());

    http.expectOne(`${BASE_URL}/owner/reviews/summary`).flush(summary);

    expect(await response).toEqual(summary);
  });

  it('sends a report on one review', async () => {
    const reported = buildOwnerReview({ reportStatus: 'pending' });
    const response = firstValueFrom(
      repository.reportReview('review-1', { reason: 'fake', notes: 'لم يزر المتجر' }),
    );

    const request = http.expectOne(`${BASE_URL}/owner/reviews/review-1/report`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ reason: 'fake', notes: 'لم يزر المتجر' });
    request.flush(reported);

    expect(await response).toEqual(reported);
  });
});
