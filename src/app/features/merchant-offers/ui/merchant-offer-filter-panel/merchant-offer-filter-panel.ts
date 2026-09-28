import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { CAMPAIGN_STATUS_LABEL, CampaignStatus } from '../../../../shared/models/campaign-status';
import { DatePeriod } from '../../../../shared/models/date-period';
import { DateRange } from '../../../../shared/models/date-range';
import { OfferScope } from '../../../../shared/models/offer-scope';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { ChoiceOption } from '../../../../shared/ui/choice-chips/choice-option';
import { DatePeriodFilter } from '../../../../shared/ui/date-period-filter/date-period-filter';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import {
  MerchantOfferFilters,
  NO_MERCHANT_OFFER_FILTERS,
} from '../../models/merchant-offer-filters';

/** Right to left, as the frame draws them; a draft is not a status the owner filters by. */
const STATUS_ORDER: readonly CampaignStatus[] = ['active', 'scheduled', 'paused', 'expired'];
const STATUS_CHOICES: readonly ChoiceOption[] = STATUS_ORDER.map((status) => ({
  value: status,
  label: CAMPAIGN_STATUS_LABEL[status],
}));

const SCOPE_CHOICES: readonly { readonly value: OfferScope | ''; readonly label: string }[] = [
  { value: '', label: 'الكل' },
  { value: 'allItems', label: 'جميع المنتجات/الخدمات' },
  { value: 'selectedItems', label: 'منتجات وخدمات محددة' },
];

/** The 384px popover under "الفلاتر". Picks stay a draft until applied. */
@Component({
  selector: 'app-merchant-offer-filter-panel',
  imports: [AppIcon, ChoiceChips, DatePeriodFilter, FilterPopover],
  templateUrl: './merchant-offer-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferFilterPanel {
  readonly filters = input.required<MerchantOfferFilters>();
  readonly applied = output<MerchantOfferFilters>();
  readonly closed = output<void>();

  protected readonly statusChoices = STATUS_CHOICES;
  protected readonly scopeChoices = SCOPE_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(
    () => this.draft().period !== 'custom' || isDateRangeValid(this.draft().customRange),
  );

  /** The frame has no "الكل" chip, so a second press on the picked status clears it. */
  protected pickStatus(status: string | null): void {
    const picked = status === this.draft().status ? null : (status as CampaignStatus | null);
    this.draft.update((draft) => ({ ...draft, status: picked }));
  }

  protected pickScope(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OfferScope | '';
    this.draft.update((draft) => ({ ...draft, scope: value || null }));
  }

  protected pickPeriod(period: DatePeriod): void {
    this.draft.update((draft) => ({ ...draft, period }));
  }

  protected changeCustomRange(customRange: DateRange): void {
    this.draft.update((draft) => ({ ...draft, customRange }));
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_MERCHANT_OFFER_FILTERS);
    this.applied.emit(NO_MERCHANT_OFFER_FILTERS);
  }
}
