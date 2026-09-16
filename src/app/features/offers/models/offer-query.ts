import { ListQuery } from '../../../shared/models/list-query';
import { CampaignStatus } from '../../../shared/models/campaign-status';

export interface OfferQuery extends ListQuery {
  readonly status?: CampaignStatus;
  /** Keeps offers that run on at least one day of this inclusive range, written `yyyy-mm-dd`. */
  readonly runningFrom?: string;
  readonly runningTo?: string;
}
