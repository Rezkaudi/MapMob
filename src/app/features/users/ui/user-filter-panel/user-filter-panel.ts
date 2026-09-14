import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { ActivationStatus } from '../../../../shared/models/activation-status';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DateRange } from '../../models/date-range';
import { RegistrationPeriod } from '../../models/registration-period';
import { UserAccountType } from '../../models/user-account-type';
import { NO_USER_FILTERS, UserFilters } from '../../models/user-filters';
import { FilterSegmentedControl } from '../filter-segmented-control/filter-segmented-control';
import { SegmentOption } from '../filter-segmented-control/segment-option';
import { RegistrationDateFilter } from '../registration-date-filter/registration-date-filter';
import { isDateRangeValid } from './date-range-summary';

const ACCOUNT_TYPE_OPTIONS: readonly SegmentOption[] = [
  { value: null, label: 'الكل', tone: 'primary' },
  { value: 'registered', label: 'مسجل', tone: 'primary' },
  { value: 'visitor', label: 'زائر', tone: 'primary' },
];

const STATUS_OPTIONS: readonly SegmentOption[] = [
  { value: null, label: 'الكل', tone: 'primary' },
  { value: 'active', label: 'نشط', tone: 'success' },
  { value: 'suspended', label: 'موقوف', tone: 'danger' },
];

/** The 420px popover under "الفلاتر". Picks stay a draft until "تطبيق الفلاتر". */
@Component({
  selector: 'app-user-filter-panel',
  imports: [AppIcon, FilterSegmentedControl, RegistrationDateFilter],
  templateUrl: './user-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFilterPanel {
  readonly filters = input.required<UserFilters>();
  readonly applied = output<UserFilters>();
  readonly closed = output<void>();

  protected readonly accountTypeOptions = ACCOUNT_TYPE_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const draft = this.draft();
    return draft.registrationPeriod !== 'custom' || isDateRangeValid(draft.customRange);
  });

  protected pickAccountType(accountType: string | null): void {
    this.patchDraft({ accountType: accountType as UserAccountType | null });
  }

  protected pickStatus(status: string | null): void {
    this.patchDraft({ status: status as ActivationStatus | null });
  }

  protected pickPeriod(registrationPeriod: RegistrationPeriod): void {
    this.patchDraft({ registrationPeriod });
  }

  protected changeCustomRange(customRange: DateRange): void {
    this.patchDraft({ customRange });
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_USER_FILTERS);
    this.applied.emit(NO_USER_FILTERS);
  }

  private patchDraft(patch: Partial<UserFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
