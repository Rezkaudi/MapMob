import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ReviewQuery } from '../models/review-query';
import { ModeratedReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';

export abstract class ReviewRepository {
  abstract getReviews(query: ReviewQuery): Observable<PagedResult<Review>>;
  abstract getSummary(): Observable<ReviewSummary>;
  abstract getReviewDetail(id: string): Observable<ReviewDetail>;
  /** Agrees with the reporter: the review is hidden and the report is settled. */
  abstract acceptReport(id: string): Observable<Review>;
  /** Sides with the reviewer: the review stays published and the report is settled. */
  abstract rejectReport(id: string): Observable<Review>;
  abstract setReviewStatus(id: string, status: ModeratedReviewStatus): Observable<Review>;
  abstract deleteReview(id: string): Observable<void>;
  /** Every review matching the filters, not just one page. */
  abstract exportReviews(query: ReviewQuery): Observable<Blob>;
}
