import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { OwnerReviewReportStatus } from './owner-review-report-status';

/** What the filter panel applies. `null` means "الكل". */
export interface OwnerReviewFilters {
  /** Whole stars, 1 to 5. */
  readonly rating: number | null;
  readonly reportStatus: OwnerReviewReportStatus | null;
  readonly period: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_OWNER_REVIEW_FILTERS: OwnerReviewFilters = {
  rating: null,
  reportStatus: null,
  period: 'all',
  customRange: { from: null, to: null },
};
