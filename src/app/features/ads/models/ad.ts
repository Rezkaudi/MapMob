import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdAdvertiserType } from './ad-advertiser-type';
import { AdContentType } from './ad-content-type';
import { AdPlacement } from './ad-placement';
import { AdPriority } from './ad-priority';

export interface Ad {
  readonly id: string;
  readonly title: string;
  readonly advertiserType: AdAdvertiserType;
  /** `null` for an ad the app's own team runs. */
  readonly placeName: string | null;
  readonly contentType: AdContentType;
  readonly placement: AdPlacement;
  readonly priority: AdPriority;
  /** Calendar days written `yyyy-mm-dd`; `endsOn` is `null` for an ad that never ends. */
  readonly startsOn: string;
  readonly endsOn: string | null;
  readonly status: CampaignStatus;
}
