import { LiveOwnerPlan } from './live-owner-plan';
import { LiveOwnerPlanRequest } from './live-owner-plan-request';
import { LiveOwnerSubscription } from './live-owner-subscription';
import { LiveOwnerUsageCount } from './live-owner-usage-count';

/** GET /owner/subscription */
export interface LiveOwnerSubscriptionOverview {
  readonly current: LiveOwnerSubscription | null;
  readonly history: readonly LiveOwnerSubscription[];
  readonly availablePlans: readonly LiveOwnerPlan[];
  readonly usage: {
    readonly productsAndServices: LiveOwnerUsageCount;
    readonly media: LiveOwnerUsageCount;
    readonly offers: LiveOwnerUsageCount;
    readonly ads: LiveOwnerUsageCount;
  };
  readonly requests: readonly LiveOwnerPlanRequest[];
}
