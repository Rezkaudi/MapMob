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
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DatePeriodFilter } from '../../../../shared/ui/date-period-filter/date-period-filter';
import { NO_REVIEW_FILTERS, ReviewFilters } from '../../models/review-filters';
import { ReviewRatingFilter } from '../../models/review-rating-filter';
import { ReviewStatus } from '../../models/review-status';
import { ReviewPlaceField } from '../review-place-field/review-place-field';
import { ReviewRatingPicker } from '../review-rating-picker/review-rating-picker';
import { ReviewStatusPicker } from '../review-status-picker/review-status-picker';

/** The 384px popover under "الفلاتر". Picks stay a draft until "تطبيق الفلاتر". */
@Component({
  selector: 'app-review-filter-panel',
  imports: [AppIcon, DatePeriodFilter, ReviewPlaceField, ReviewRatingPicker, ReviewStatusPicker],
  templateUrl: './review-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFilterPanel {
  readonly filters = input.required<ReviewFilters>();
  readonly applied = output<ReviewFilters>();
  readonly closed = output<void>();

  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const draft = this.draft();
    return draft.period !== 'custom' || isDateRangeValid(draft.customRange);
  });

  protected pickRating(rating: ReviewRatingFilter | null): void {
    this.patchDraft({ rating });
  }

  protected pickStatus(status: ReviewStatus | null): void {
    this.patchDraft({ status });
  }

  protected changePlaceName(placeName: string): void {
    this.patchDraft({ placeName });
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
    this.draft.set(NO_REVIEW_FILTERS);
    this.applied.emit(NO_REVIEW_FILTERS);
  }

  private patchDraft(patch: Partial<ReviewFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
