import { CampaignStatus } from '../../../shared/models/campaign-status';
import { DatePeriod } from '../../../shared/models/date-period';
import { DateRange } from '../../../shared/models/date-range';
import { OfferScope } from '../../../shared/models/offer-scope';

/** What the filter popover applies. `null` means "any". */
export interface MerchantOfferFilters {
  readonly status: CampaignStatus | null;
  readonly scope: OfferScope | null;
  readonly period: DatePeriod;
  /** Only read when the period is `custom`. */
  readonly customRange: DateRange;
}

export const NO_MERCHANT_OFFER_FILTERS: MerchantOfferFilters = {
  status: null,
  scope: null,
  period: 'all',
  customRange: { from: null, to: null },
};
