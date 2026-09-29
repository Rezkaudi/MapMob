import { MerchantPlan } from '../models/merchant-plan';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanAction } from '../models/plan-action';
import { PLAN_TIER_RANK } from './plan-tier-rank';
import { isRenewalDue } from './renewal-window';

function rankCurrentTier(overview: MerchantSubscriptionOverview): number {
  const current = overview.plans.find((plan) => plan.id === overview.current.plan.id);
  return PLAN_TIER_RANK[current?.tier ?? 'free'];
}

function chooseCurrentAction(
  plan: MerchantPlan,
  overview: MerchantSubscriptionOverview,
  today: string,
): PlanAction {
  const canRenew = plan.tier !== 'free' && isRenewalDue(overview.current, today);
  return canRenew
    ? { kind: 'renewal', label: 'تجديد الاشتراك', isDisabled: overview.pendingRequest !== null }
    : { kind: 'current', label: 'باقتك الحالية النشطة', isDisabled: true };
}

export function choosePlanAction(
  plan: MerchantPlan,
  overview: MerchantSubscriptionOverview,
  today: string,
): PlanAction {
  if (overview.pendingRequest?.plan.id === plan.id) {
    return { kind: 'pending', label: 'طلبك قيد المراجعة', isDisabled: true };
  }
  if (plan.id === overview.current.plan.id) {
    return chooseCurrentAction(plan, overview, today);
  }
  // One request at a time: the server refuses a second one with 409 anyway.
  const isDisabled = overview.pendingRequest !== null;
  return PLAN_TIER_RANK[plan.tier] > rankCurrentTier(overview)
    ? { kind: 'upgrade', label: 'ترقية الباقة الآن', isDisabled }
    : { kind: 'downgrade', label: `اختيار ${plan.name}`, isDisabled };
}

/** The hero's "ترقية الباقة" goes one tier up; null on the top tier. */
export function findUpgradeTarget(overview: MerchantSubscriptionOverview): MerchantPlan | null {
  const currentRank = rankCurrentTier(overview);
  const dearer = overview.plans
    .filter((plan) => PLAN_TIER_RANK[plan.tier] > currentRank)
    .sort((first, second) => PLAN_TIER_RANK[first.tier] - PLAN_TIER_RANK[second.tier]);
  return dearer[0] ?? null;
}
