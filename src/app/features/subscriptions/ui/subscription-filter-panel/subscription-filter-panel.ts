import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { DateRange } from '../../../../shared/models/date-range';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { DateRangeFields } from '../../../../shared/ui/date-range-fields/date-range-fields';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { PlanTier } from '../../models/plan-tier';
import {
  PLAN_TIER_CHOICES,
  SUBSCRIPTION_STATUS_CHOICES,
} from '../../models/subscription-choices';
import {
  NO_SUBSCRIPTION_FILTERS,
  SubscriptionFilters,
} from '../../models/subscription-filters';
import { SubscriptionStatus } from '../../models/subscription-status';

/** The popover under "الفلاتر". Picks stay a draft until "تطبيق الفلاتر". */
@Component({
  selector: 'app-subscription-filter-panel',
  imports: [ChoiceChips, DateRangeFields, FilterPopover],
  templateUrl: './subscription-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionFilterPanel {
  readonly filters = input.required<SubscriptionFilters>();
  readonly applied = output<SubscriptionFilters>();
  readonly closed = output<void>();

  protected readonly tierOptions = PLAN_TIER_CHOICES;
  protected readonly statusOptions = SUBSCRIPTION_STATUS_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const { from, to } = this.draft().subscribedRange;
    return !from || !to || isDateRangeValid({ from, to });
  });

  protected pickTier(tier: string | null): void {
    this.patchDraft({ tier: tier as PlanTier | null });
  }

  protected pickStatus(status: string | null): void {
    this.patchDraft({ status: status as SubscriptionStatus | null });
  }

  protected changeRange(subscribedRange: DateRange): void {
    this.patchDraft({ subscribedRange });
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_SUBSCRIPTION_FILTERS);
    this.applied.emit(NO_SUBSCRIPTION_FILTERS);
  }

  private patchDraft(patch: Partial<SubscriptionFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
