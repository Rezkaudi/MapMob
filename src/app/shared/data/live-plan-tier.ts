import { PlanTier } from '../models/plan-tier';
import { LivePlan } from './live-plan';

/** The server has no tier, so it is worked out from the price among all plans. */
export function toPlanTier(plan: LivePlan, allPlans: readonly LivePlan[]): PlanTier {
  if (plan.price <= 0) {
    return 'free';
  }
  const highestPrice = Math.max(...allPlans.map((candidate) => candidate.price));
  return plan.price >= highestPrice ? 'featured' : 'basic';
}
