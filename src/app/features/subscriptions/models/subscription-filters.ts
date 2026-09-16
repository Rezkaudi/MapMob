import { DateRange } from '../../../shared/models/date-range';
import { PlanTier } from './plan-tier';
import { SubscriptionStatus } from './subscription-status';

/** What the "تصفية الاشتراكات" popover can narrow the table by. */
export interface SubscriptionFilters {
  readonly tier: PlanTier | null;
  readonly status: SubscriptionStatus | null;
  readonly subscribedRange: DateRange;
}

export const NO_SUBSCRIPTION_FILTERS: SubscriptionFilters = {
  tier: null,
  status: null,
  subscribedRange: { from: null, to: null },
};
