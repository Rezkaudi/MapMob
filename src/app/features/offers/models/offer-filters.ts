import { DateRange } from '../../../shared/models/date-range';
import { CampaignStatus } from '../../../shared/models/campaign-status';

/** What the filter panel applies. `null` and an open range mean "الكل". */
export interface OfferFilters {
  readonly status: CampaignStatus | null;
  readonly runningRange: DateRange;
}

export const NO_OFFER_FILTERS: OfferFilters = {
  status: null,
  runningRange: { from: null, to: null },
};
