import { CampaignStatus } from '../../../shared/models/campaign-status';
import { OfferScope } from '../../../shared/models/offer-scope';

/** One offer of the merchant's own place. */
export interface MerchantOffer {
  readonly id: string;
  readonly title: string;
  /** null when the owner left it blank. */
  readonly description: string | null;
  readonly discountPercent: number;
  readonly scope: OfferScope;
  /** Only filled when the scope is `selectedItems`. */
  readonly itemIds: readonly string[];
  /** Calendar days written `yyyy-mm-dd`, both included in the offer. */
  readonly startsOn: string;
  readonly endsOn: string;
  /** Worked out by the server from the days, the pause flag and the draft flag. */
  readonly status: CampaignStatus;
  readonly imageUrl: string | null;
  /** ISO moment; sorts the table by newest or oldest. */
  readonly createdAt: string;
}
