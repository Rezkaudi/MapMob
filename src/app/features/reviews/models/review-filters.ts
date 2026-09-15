import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { ReviewRatingFilter } from './review-rating-filter';
import { ReviewStatus } from './review-status';

/** What the filter panel applies. `null` and an empty place mean "الكل". */
export interface ReviewFilters {
  readonly rating: ReviewRatingFilter | null;
  readonly status: ReviewStatus | null;
  readonly placeName: string;
  readonly period: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_REVIEW_FILTERS: ReviewFilters = {
  rating: null,
  status: null,
  placeName: '',
  period: 'all',
  customRange: { from: null, to: null },
};
