import { CampaignStatus } from '../../../shared/models/campaign-status';
import { DateRange } from '../../../shared/models/date-range';
import { AdAdvertiserType } from './ad-advertiser-type';
import { AdContentType } from './ad-content-type';
import { AdPlacement } from './ad-placement';

/** What the filter panel applies. `null` and an open range mean "الكل". */
export interface AdFilters {
  readonly status: CampaignStatus | null;
  readonly contentType: AdContentType | null;
  readonly advertiserType: AdAdvertiserType | null;
  readonly placement: AdPlacement | null;
  readonly runningRange: DateRange;
}

export const NO_AD_FILTERS: AdFilters = {
  status: null,
  contentType: null,
  advertiserType: null,
  placement: null,
  runningRange: { from: null, to: null },
};
