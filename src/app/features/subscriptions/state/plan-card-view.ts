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

function buildPrice(plan: PackagePlan): PlanPriceDisplay {
  if (plan.monthlyPrice === 0) {
    return { amount: 'مجاناً', currency: null, period: '/ دائماً' };
  }
  return { amount: String(plan.monthlyPrice), currency: plan.currency, period: '/ شهرياً' };
}

function buildSubscriberLine(plan: PackagePlan): string {
  const noun = plan.tier === 'featured' ? 'شركات مميزة مشتركة' : 'متجر مشترك حالياً';
  return `${plan.subscriberCount} ${noun}`;
}

export function buildPlanCardView(plan: PackagePlan): PlanCardView {
  return {
    price: buildPrice(plan),
    subscriberLine: buildSubscriberLine(plan),
    limitRows: buildPlanLimitRows(plan.limits),
  };
}
