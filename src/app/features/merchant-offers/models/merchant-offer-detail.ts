import { CampaignPauseAction } from '../../../shared/models/campaign-pause-action';
import { MerchantOffer } from './merchant-offer';

/** The offer the drawer shows, read from the catalog so a pause shows at once. */
export interface MerchantOfferDetail {
  readonly offer: MerchantOffer;
  readonly scopeText: string;
  readonly pauseAction: CampaignPauseAction | null;
}
