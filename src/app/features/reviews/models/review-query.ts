import { ListQuery } from '../../../shared/models/list-query';
import { ReviewRatingFilter } from './review-rating-filter';
import { ReviewStatus } from './review-status';

export interface ReviewQuery extends ListQuery {
  readonly rating?: ReviewRatingFilter;
  readonly status?: ReviewStatus;
  readonly placeName?: string;
  /** Inclusive calendar days, written `yyyy-mm-dd`. */
  readonly submittedFrom?: string;
  readonly submittedTo?: string;
}
