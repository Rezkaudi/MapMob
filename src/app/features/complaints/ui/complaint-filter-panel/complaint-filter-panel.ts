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
import { ComplaintFilters, NO_COMPLAINT_FILTERS } from '../../models/complaint-filters';
import { ComplaintStatus } from '../../models/complaint-status';
import { COMPLAINT_STATUS_CHOICES } from '../../models/complaint-status-choices';

/** The 384px popover under "الفلاتر" — the compact-filter-popover-card frame. */
@Component({
  selector: 'app-complaint-filter-panel',
  imports: [ChoiceChips, DatePeriodFilter, FilterPopover],
  templateUrl: './complaint-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintFilterPanel {
  readonly filters = input.required<ComplaintFilters>();
  readonly applied = output<ComplaintFilters>();
  readonly closed = output<void>();

  protected readonly statusOptions = COMPLAINT_STATUS_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const draft = this.draft();
    return draft.reportPeriod !== 'custom' || isDateRangeValid(draft.customRange);
  });

  protected pickStatus(status: string | null): void {
    this.patchDraft({ status: status as ComplaintStatus | null });
  }

  protected pickPeriod(reportPeriod: DatePeriod): void {
    this.patchDraft({ reportPeriod });
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
    this.draft.set(NO_COMPLAINT_FILTERS);
    this.applied.emit(NO_COMPLAINT_FILTERS);
  }

  private patchDraft(patch: Partial<ComplaintFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
