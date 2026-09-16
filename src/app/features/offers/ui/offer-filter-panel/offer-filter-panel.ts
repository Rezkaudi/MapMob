import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { DateRange } from '../../../../shared/models/date-range';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { DateRangeFields } from '../../../../shared/ui/date-range-fields/date-range-fields';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { CAMPAIGN_STATUS_CHOICES } from '../../../../shared/models/campaign-status-choices';
import { NO_OFFER_FILTERS, OfferFilters } from '../../models/offer-filters';
import { CampaignStatus } from '../../../../shared/models/campaign-status';

/** The 384px popover under "الفلاتر", laid out like the ads one. Picks stay a draft until applied. */
@Component({
  selector: 'app-offer-filter-panel',
  imports: [ChoiceChips, DateRangeFields, FilterPopover],
  templateUrl: './offer-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferFilterPanel {
  readonly filters = input.required<OfferFilters>();
  readonly applied = output<OfferFilters>();
  readonly closed = output<void>();

  protected readonly statusOptions = CAMPAIGN_STATUS_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const { from, to } = this.draft().runningRange;
    return !from || !to || isDateRangeValid({ from, to });
  });

  protected pickStatus(status: string | null): void {
    this.draft.update((draft) => ({ ...draft, status: status as CampaignStatus | null }));
  }

  protected changeRange(runningRange: DateRange): void {
    this.draft.update((draft) => ({ ...draft, runningRange }));
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_OFFER_FILTERS);
    this.applied.emit(NO_OFFER_FILTERS);
  }
}
