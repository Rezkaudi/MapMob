import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { NotificationAudience } from './notification-audience';
import { NotificationKind } from './notification-kind';
import { NotificationStatus } from './notification-status';

/** What the filter panel applies. `null` means "الكل". */
export interface NotificationFilters {
  readonly audience: NotificationAudience | null;
  readonly kind: NotificationKind | null;
  readonly status: NotificationStatus | null;
  readonly sendPeriod: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_NOTIFICATION_FILTERS: NotificationFilters = {
  audience: null,
  kind: null,
  status: null,
  sendPeriod: 'all',
  customRange: { from: null, to: null },
};
