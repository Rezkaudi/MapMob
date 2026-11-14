import { PlanTier } from '../models/plan-tier';
import { LivePlan } from './live-plan';
import { toPlanTier } from './live-plan-tier';

export const FREE_PLAN_SLUG = 'free';

/** The server filters by one plan slug, so a tier with several plans filters by the first. */
export function toLivePlanSlug(tier: PlanTier, plans: readonly LivePlan[]): string {
  if (tier === 'free') {
    return FREE_PLAN_SLUG;
  }
  const plan = plans.find(
    (candidate) => candidate.price > 0 && toPlanTier(candidate, plans) === tier,
  );
  return plan?.slug ?? tier;
}
