import { PackagePlan } from '../models/package-plan';
import { SubscriptionSummary } from '../models/subscription-summary';
import { LiveSubscriptionSummary } from './live-subscription-summary';

const NO_SUBSCRIPTIONS = 0;

function findTopPlan(plans: readonly PackagePlan[]): PackagePlan | null {
  return plans.reduce<PackagePlan | null>(
    (best, plan) => (best === null || plan.subscriberCount > best.subscriberCount ? plan : best),
    null,
  );
}

export function summarizeLiveSubscriptions(
  plans: readonly PackagePlan[],
  counts: LiveSubscriptionSummary,
): SubscriptionSummary {
  const topPlan = findTopPlan(plans);
  return {
    topPlanName: topPlan?.name ?? '',
    topPlanSubscriberCount: topPlan?.subscriberCount ?? NO_SUBSCRIPTIONS,
    availablePlanCount: plans.filter((plan) => plan.isActive).length,
    endingSoonCount: counts.ending_soon_count ?? NO_SUBSCRIPTIONS,
    activeSubscriberCount: counts.active_count,
    activeSubscriberShare:
      counts.total_count === NO_SUBSCRIPTIONS ? 0 : counts.active_count / counts.total_count,
  };
}
