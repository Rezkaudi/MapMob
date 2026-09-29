import { Injectable, inject } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { PagedResult } from '../../../core/models/paged-result';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { ReviewReport } from '../models/review-report';
import { queryOwnerReviews, summarizeOwnerReviews } from './owner-review-mock-query';
import { OwnerReviewsRepository } from './owner-reviews.repository';

const ALREADY_REPORTED_MESSAGE = 'تم الإبلاغ عن هذه المراجعة من قبل.';
const NOT_FOUND_MESSAGE = 'المراجعة غير موجودة.';

@Injectable()
export class OwnerReviewsMockRepository implements OwnerReviewsRepository {
  private readonly clock = inject(CLOCK);
  private reviews: Promise<OwnerReview[]> | null = null;

  getReviews(query: OwnerReviewQuery): Observable<PagedResult<OwnerReview>> {
    return this.request((reviews) => queryOwnerReviews(reviews, query));
  }

  getSummary(): Observable<OwnerReviewSummary> {
    return this.request((reviews) => summarizeOwnerReviews(reviews, this.clock()));
  }

  reportReview(id: string, _report: ReviewReport): Observable<OwnerReview> {
    return this.request((reviews) => markReported(reviews, id));
  }

  private request<T>(work: (reviews: OwnerReview[]) => T): Observable<T> {
    return defer(() => from(this.loadReviews())).pipe(
      switchMap((reviews) => mockRequest(() => work(reviews))),
    );
  }

  // Loaded on first use, so the seed copy stays out of the start-up bundle.
  private loadReviews(): Promise<OwnerReview[]> {
    this.reviews ??= import('./owner-reviews-mock-seed').then(({ buildOwnerReviewSeed }) =>
      buildOwnerReviewSeed(this.clock()),
    );
    return this.reviews;
  }
}

function markReported(reviews: OwnerReview[], id: string): OwnerReview {
  const index = reviews.findIndex((review) => review.id === id);
  if (index < 0) {
    throw new Error(NOT_FOUND_MESSAGE);
  }
  if (reviews[index].reportStatus !== 'none') {
    throw new Error(ALREADY_REPORTED_MESSAGE);
  }
  const reported: OwnerReview = { ...reviews[index], reportStatus: 'pending' };
  reviews[index] = reported;
  return reported;
}
