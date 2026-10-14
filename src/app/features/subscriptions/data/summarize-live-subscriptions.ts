import { addCalendarDays } from '../../../shared/formatting/calendar-day';
import { PackagePlan } from '../models/package-plan';
import { Subscription } from '../models/subscription';
import { SubscriptionSummary } from '../models/subscription-summary';

const ENDING_SOON_DAY_COUNT = 7;

function findTopPlan(plans: readonly PackagePlan[]): PackagePlan | null {
  return plans.reduce<PackagePlan | null>(
    (best, plan) => (best === null || plan.subscriberCount > best.subscriberCount ? plan : best),
    null,
  );
}

/** The server has no summary route, so the strip is counted from the plans and the rows. */
export function summarizeLiveSubscriptions(
  plans: readonly PackagePlan[],
  subscriptions: readonly Subscription[],
  today: string,
): SubscriptionSummary {
  const topPlan = findTopPlan(plans);
  const active = subscriptions.filter((entry) => entry.status === 'active');
  const lastSoonDay = addCalendarDays(today, ENDING_SOON_DAY_COUNT);
  return {
    topPlanName: topPlan?.name ?? '',
    topPlanSubscriberCount: topPlan?.subscriberCount ?? 0,
    availablePlanCount: plans.filter((plan) => plan.isActive).length,
    endingSoonCount: active.filter((entry) => entry.endsOn >= today && entry.endsOn <= lastSoonDay)
      .length,
    activeSubscriberCount: active.length,
    activeSubscriberShare: subscriptions.length === 0 ? 0 : active.length / subscriptions.length,
  };
}
