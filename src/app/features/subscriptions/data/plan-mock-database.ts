import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { SubscriptionSummary } from '../models/subscription-summary';

/** Counts that come from the subscription records rather than from the packages. */
const ENDING_SOON_COUNT = 7;
const ACTIVE_SUBSCRIBER_COUNT = 1200;
const ACTIVE_SUBSCRIBER_SHARE = 0.9;

/** In-memory store behind the mock repository, so edits and deletes stick. */
export class PlanMockDatabase {
  private plans: PackagePlan[];

  constructor(seed: readonly PackagePlan[]) {
    this.plans = [...seed];
  }

  listPlans(): readonly PackagePlan[] {
    return this.plans;
  }

  update(id: string, draft: PlanDraft): PackagePlan {
    return this.replace(id, (plan) => ({
      ...plan,
      name: draft.name,
      isActive: draft.isActive,
      monthlyPrice: draft.monthlyPrice,
      yearlyPrice: draft.yearlyPrice,
      currency: draft.currency,
      limits: draft.limits,
      features: draft.features,
    }));
  }

  setActive(id: string, isActive: boolean): PackagePlan {
    return this.replace(id, (plan) => ({ ...plan, isActive }));
  }

  remove(id: string): void {
    this.find(id);
    this.plans = this.plans.filter((plan) => plan.id !== id);
  }

  summarise(): SubscriptionSummary {
    const topPlan = this.plans.reduce((best, plan) =>
      plan.subscriberCount > best.subscriberCount ? plan : best,
    );
    return {
      topPlanName: topPlan.name,
      topPlanSubscriberCount: topPlan.subscriberCount,
      availablePlanCount: this.plans.length,
      endingSoonCount: ENDING_SOON_COUNT,
      activeSubscriberCount: ACTIVE_SUBSCRIBER_COUNT,
      activeSubscriberShare: ACTIVE_SUBSCRIBER_SHARE,
    };
  }

  private find(id: string): PackagePlan {
    const plan = this.plans.find((candidate) => candidate.id === id);
    if (!plan) {
      throw new Error(`لم يتم العثور على الباقة ${id}`);
    }
    return plan;
  }

  private replace(id: string, change: (plan: PackagePlan) => PackagePlan): PackagePlan {
    const saved = change(this.find(id));
    this.plans = this.plans.map((plan) => (plan.id === id ? saved : plan));
    return saved;
  }
}
