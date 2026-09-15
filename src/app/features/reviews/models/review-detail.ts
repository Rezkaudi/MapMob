import { Review } from './review';
import { ReviewReport } from './review-report';
import { ReviewedPlace } from './reviewed-place';
import { Reviewer } from './reviewer';

export interface ReviewDetail {
  readonly review: Review;
  readonly place: ReviewedPlace;
  readonly reviewer: Reviewer;
  readonly report: ReviewReport | null;
}
