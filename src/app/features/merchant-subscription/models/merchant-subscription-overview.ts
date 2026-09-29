import { MerchantPlan } from './merchant-plan';
import { PlanChangeRequest } from './plan-change-request';
import { PlanUsage } from './plan-usage';
import { SubscriptionRecord } from './subscription-record';

/** Everything the "الاشتراكات و الباقات" page reads in one request. */
export interface MerchantSubscriptionOverview {
  readonly current: SubscriptionRecord;
  readonly usage: PlanUsage;
  /** Cheapest first. */
  readonly plans: readonly MerchantPlan[];
  /** Newest first, the current period included. */
  readonly history: readonly SubscriptionRecord[];
  readonly pendingRequest: PlanChangeRequest | null;
}
