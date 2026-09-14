import { ActivationStatus } from '../../../shared/models/activation-status';
import { DateRange } from './date-range';
import { RegistrationPeriod } from './registration-period';
import { UserAccountType } from './user-account-type';

/** What the filter panel applies. `null` means "الكل". */
export interface UserFilters {
  readonly accountType: UserAccountType | null;
  readonly status: ActivationStatus | null;
  readonly registrationPeriod: RegistrationPeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_USER_FILTERS: UserFilters = {
  accountType: null,
  status: null,
  registrationPeriod: 'all',
  customRange: { from: null, to: null },
};
