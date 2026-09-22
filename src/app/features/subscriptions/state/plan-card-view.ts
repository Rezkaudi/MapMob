import { BillingCycle } from '../models/billing-cycle';
import { PackagePlan } from '../models/package-plan';
import { PlanLimitRow, buildPlanLimitRows } from './plan-limit-rows';

/** The price line: a big amount, the currency beside it, then the billing period. */
export interface PlanPriceDisplay {
  readonly amount: string;
  readonly currency: string | null;
  readonly period: string;
}

export interface PlanCardView {
  readonly price: PlanPriceDisplay;
  readonly subscriberLine: string;
  readonly limitRows: readonly PlanLimitRow[];
}

function buildPrice(plan: PackagePlan, cycle: BillingCycle): PlanPriceDisplay {
  if (plan.monthlyPrice === 0) {
    return { amount: 'مجاناً', currency: null, period: '/ دائماً' };
  }
  if (cycle === 'yearly' && plan.yearlyPrice !== null) {
    return { amount: String(plan.yearlyPrice), currency: plan.currency, period: '/ سنوياً' };
  }
  return { amount: String(plan.monthlyPrice), currency: plan.currency, period: '/ شهرياً' };
}

function buildSubscriberLine(plan: PackagePlan): string {
  const noun = plan.tier === 'featured' ? 'شركات مميزة مشتركة' : 'متجر مشترك حالياً';
  return `${plan.subscriberCount} ${noun}`;
}

export function buildPlanCardView(
  plan: PackagePlan,
  cycle: BillingCycle = 'monthly',
): PlanCardView {
  return {
    price: buildPrice(plan, cycle),
    subscriberLine: buildSubscriberLine(plan),
    limitRows: buildPlanLimitRows(plan.limits),
  };
}
