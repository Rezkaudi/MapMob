import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewQuery } from '../models/review-query';
import { ReviewSummary } from '../models/review-summary';

export abstract class ReviewRepository {
  abstract getReviews(query: ReviewQuery): Observable<PagedResult<Review>>;
  abstract getSummary(): Observable<ReviewSummary>;
}
