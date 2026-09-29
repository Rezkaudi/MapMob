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
import { ChoiceOption } from '../../../../shared/ui/choice-chips/choice-option';
import { DatePeriodFilter } from '../../../../shared/ui/date-period-filter/date-period-filter';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { NO_OWNER_REVIEW_FILTERS, OwnerReviewFilters } from '../../models/owner-review-filters';
import { OwnerReviewReportStatus } from '../../models/owner-review-report-status';

const ALL_CHOICE: ChoiceOption = { value: null, label: 'الكل' };

const RATING_CHOICES: readonly ChoiceOption[] = [
  ALL_CHOICE,
  ...['5', '4', '3', '2', '1'].map((stars) => ({ value: stars, label: stars })),
];

/** Shorter than the table's pill words, so the chips fit two rows. */
const REPORT_STATUS_CHOICES: readonly ChoiceOption[] = [
  ALL_CHOICE,
  { value: 'none', label: 'غير مبلغ عنه' },
  { value: 'pending', label: 'قيد المراجعة' },
  { value: 'accepted', label: 'مخفية' },
  { value: 'rejected', label: 'رُفض البلاغ' },
];

/** The 384px popover under "الفلاتر". Picks stay a draft until "تطبيق الفلاتر". */
@Component({
  selector: 'app-owner-review-filter-panel',
  imports: [ChoiceChips, DatePeriodFilter, FilterPopover],
  templateUrl: './owner-review-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReviewFilterPanel {
  readonly filters = input.required<OwnerReviewFilters>();
  readonly applied = output<OwnerReviewFilters>();
  readonly closed = output<void>();

  protected readonly ratingChoices = RATING_CHOICES;
  protected readonly reportStatusChoices = REPORT_STATUS_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly selectedRating = computed(() => this.draft().rating?.toString() ?? null);
  protected readonly canApply = computed(
    () => this.draft().period !== 'custom' || isDateRangeValid(this.draft().customRange),
  );

  protected pickRating(stars: string | null): void {
    this.patchDraft({ rating: stars === null ? null : Number(stars) });
  }

  protected pickReportStatus(status: string | null): void {
    this.patchDraft({ reportStatus: status as OwnerReviewReportStatus | null });
  }

  protected pickPeriod(period: DatePeriod): void {
    this.patchDraft({ period });
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
    this.draft.set(NO_OWNER_REVIEW_FILTERS);
    this.applied.emit(NO_OWNER_REVIEW_FILTERS);
  }

  private patchDraft(patch: Partial<OwnerReviewFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
