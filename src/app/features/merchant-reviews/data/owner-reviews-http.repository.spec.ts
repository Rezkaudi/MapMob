import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { OwnerReviewsHttpRepository } from './owner-reviews-http.repository';

const BASE_URL = 'https://api.test';
const REVIEWS_URL = `${BASE_URL}/owner/reviews`;

const LIVE_REVIEW = {
  id: 9,
  rating: 5,
  comment: 'ممتاز',
  user: { id: 3, name: 'سارة' },
  createdAt: '2026-10-26T10:00:00Z',
};

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

  it('reads every review and filters, sorts and pages them here', async () => {
    const response = firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 1, rating: 5 }),
    );

    http
      .expectOne((one) => one.url === REVIEWS_URL)
      .flush({
        data: [
          LIVE_REVIEW,
          { ...LIVE_REVIEW, id: 10, rating: 3 },
          { ...LIVE_REVIEW, id: 11, createdAt: '2026-10-20T10:00:00Z' },
        ],
        meta: { current_page: 1, last_page: 1 },
      });

    const page = await response;
    expect(page.totalCount).toBe(2);
    expect(page.items).toEqual([
      {
        id: '9',
        author: { id: '3', name: 'سارة' },
        rating: 5,
        comment: 'ممتاز',
        createdAt: '2026-10-26T10:00:00Z',
        reportStatus: 'none',
      },
    ]);
  });

  it('reads the report state of a review the owner reported', async () => {
    const response = firstValueFrom(repository.getReviews({ pageIndex: 0, pageSize: 4 }));

    http
      .expectOne((one) => one.url === REVIEWS_URL)
      .flush({
        data: [{ ...LIVE_REVIEW, reportStatus: 'pending' }],
        meta: { current_page: 1, last_page: 1 },
      });

    expect((await response).items[0].reportStatus).toBe('pending');
  });

  it('reads the rating summary, five stars first', async () => {
    const response = firstValueFrom(repository.getSummary());

    http.expectOne(`${REVIEWS_URL}/summary`).flush({
      status_code: 200,
      data: {
        trustedReviewCount: 6,
        averageRating: 4.2,
        starDistribution: [
          { count: 3, percentage: 50 },
          { count: 2, percentage: 33 },
          { count: 1, percentage: 17 },
          { count: 0, percentage: 0 },
          { count: 0, percentage: 0 },
        ],
        monthly: { newReviews: 4, previousComparablePeriodReviews: 2 },
      },
    });

    expect(await response).toEqual({
      averageRating: 4.2,
      ratedCount: 6,
      starCounts: [
        { stars: 5, count: 3 },
        { stars: 4, count: 2 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
      thisMonthCount: 4,
      lastMonthCount: 2,
    });
  });

  it('sends a report on one review', async () => {
    const response = firstValueFrom(
      repository.reportReview('9', { reason: 'fake', notes: 'لم يزر المتجر' }),
    );

    const request = http.expectOne(`${REVIEWS_URL}/9/report`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ reason: 'fake', notes: 'لم يزر المتجر' });
    request.flush({ status_code: 201, data: { id: 4, reason: 'fake', status: 'pending' } });

    expect((await response).reportStatus).toBe('pending');
  });
});
