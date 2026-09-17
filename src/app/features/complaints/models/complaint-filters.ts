import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { ComplaintStatus } from './complaint-status';

/** What the filter panel applies. `null` means "الكل". */
export interface ComplaintFilters {
  readonly status: ComplaintStatus | null;
  readonly reportPeriod: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_COMPLAINT_FILTERS: ComplaintFilters = {
  status: null,
  reportPeriod: 'all',
  customRange: { from: null, to: null },
};
