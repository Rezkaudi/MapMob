import { CampaignStatus } from '../../../shared/models/campaign-status';

export interface Offer {
  readonly id: string;
  readonly title: string;
  readonly placeName: string;
  readonly categoryName: string;
  /** Calendar days written `yyyy-mm-dd`, both included in the offer. */
  readonly startsOn: string;
  readonly endsOn: string;
  readonly status: CampaignStatus;
}
