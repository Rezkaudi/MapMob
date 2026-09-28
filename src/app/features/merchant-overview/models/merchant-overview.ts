import { MerchantActivity } from './merchant-activity';
import { MerchantReview } from './merchant-review';
import { MerchantStats } from './merchant-stats';
import { MerchantSubscription } from './merchant-subscription';

export interface MerchantOverview {
  readonly placeName: string;
  readonly stats: MerchantStats;
  readonly activities: readonly MerchantActivity[];
  readonly latestReviews: readonly MerchantReview[];
  /** Null when the store has no active package. */
  readonly subscription: MerchantSubscription | null;
}
