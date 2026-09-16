import { CampaignStatus } from '../../../shared/models/campaign-status';
import { ListQuery } from '../../../shared/models/list-query';
import { AdAdvertiserType } from './ad-advertiser-type';
import { AdContentType } from './ad-content-type';
import { AdPlacement } from './ad-placement';

export interface AdQuery extends ListQuery {
  readonly status?: CampaignStatus;
  readonly contentType?: AdContentType;
  readonly advertiserType?: AdAdvertiserType;
  readonly placement?: AdPlacement;
  /** Keeps ads that run on at least one day of this inclusive range, written `yyyy-mm-dd`. */
  readonly runningFrom?: string;
  readonly runningTo?: string;
}
