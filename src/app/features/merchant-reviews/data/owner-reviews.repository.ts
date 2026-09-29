import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { ReviewReport } from '../models/review-report';

export abstract class OwnerReviewsRepository {
  abstract getReviews(query: OwnerReviewQuery): Observable<PagedResult<OwnerReview>>;
  abstract getSummary(): Observable<OwnerReviewSummary>;
  /** Sends the review to the admins; it comes back with its report `pending`. */
  abstract reportReview(id: string, report: ReviewReport): Observable<OwnerReview>;
}
