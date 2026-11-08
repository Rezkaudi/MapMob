import { CampaignStatus } from '../../../shared/models/campaign-status';
import { ListSort } from '../../../shared/models/list-sort';
import { OfferScope } from '../../../shared/models/offer-scope';

/** What the offers page asks the server for. Days are written `yyyy-mm-dd`. */
export interface MerchantOfferQuery {
  readonly search: string;
  readonly sort: ListSort | null;
  readonly status: CampaignStatus | null;
  readonly scope: OfferScope | null;
  /** Keeps offers that run on at least one day of this inclusive range. */
  readonly runningFrom: string | null;
  readonly runningTo: string | null;
}
