import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { DatePeriod } from '../../../../shared/models/date-period';
import { DateRange } from '../../../../shared/models/date-range';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { DatePeriodFilter } from '../../../../shared/ui/date-period-filter/date-period-filter';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { NotificationAudience } from '../../models/notification-audience';
import {
  AUDIENCE_CHOICES,
  KIND_CHOICES,
  STATUS_CHOICES,
} from '../../models/notification-filter-choices';
import { NO_NOTIFICATION_FILTERS, NotificationFilters } from '../../models/notification-filters';
import { NotificationKind } from '../../models/notification-kind';
import { NotificationStatus } from '../../models/notification-status';

/** The 384px popover under "الفلاتر" — the compact-filter-popover-card frame. */
@Component({
  selector: 'app-notification-filter-panel',
  imports: [ChoiceChips, DatePeriodFilter, FilterPopover],
  templateUrl: './notification-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationFilterPanel {
  readonly filters = input.required<NotificationFilters>();
  readonly applied = output<NotificationFilters>();
  readonly closed = output<void>();

  protected readonly audienceOptions = AUDIENCE_CHOICES;
  protected readonly kindOptions = KIND_CHOICES;
  protected readonly statusOptions = STATUS_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const draft = this.draft();
    return draft.sendPeriod !== 'custom' || isDateRangeValid(draft.customRange);
  });

  protected pickAudience(audience: string | null): void {
    this.patchDraft({ audience: audience as NotificationAudience | null });
  }

  protected pickKind(kind: string | null): void {
    this.patchDraft({ kind: kind as NotificationKind | null });
  }

  protected pickStatus(status: string | null): void {
    this.patchDraft({ status: status as NotificationStatus | null });
  }

  protected pickPeriod(sendPeriod: DatePeriod): void {
    this.patchDraft({ sendPeriod });
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
    this.draft.set(NO_NOTIFICATION_FILTERS);
    this.applied.emit(NO_NOTIFICATION_FILTERS);
  }

  private patchDraft(patch: Partial<NotificationFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
