import { ActivationStatus } from '../../../shared/models/activation-status';
import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { UserAccountType } from './user-account-type';

/** What the filter panel applies. `null` means "الكل". */
export interface UserFilters {
  readonly accountType: UserAccountType | null;
  readonly status: ActivationStatus | null;
  readonly registrationPeriod: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_USER_FILTERS: UserFilters = {
  accountType: null,
  status: null,
  registrationPeriod: 'all',
  customRange: { from: null, to: null },
};
