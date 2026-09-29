import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { BillingCycle } from '../../../shared/models/billing-cycle';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';
import { buildPlanLimitRows } from '../../../shared/state/plan-limit-rows';
import { MerchantPlan } from '../models/merchant-plan';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanCardView } from '../models/plan-card-view';
import { choosePlanAction } from './plan-action';
import { priceForCycle } from './plan-price';
import { PLAN_TIER_PITCH } from './plan-tier-pitch';
import { TERM_ADVERB } from './term-words';

function buildPlanCard(
  plan: MerchantPlan,
  overview: MerchantSubscriptionOverview,
  cycle: BillingCycle,
  today: string,
): PlanCardView {
  const price = priceForCycle(plan, cycle);
  const pitch = PLAN_TIER_PITCH[plan.tier];
  return {
    plan,
    eyebrow: pitch.eyebrow,
    amountText: formatGroupedNumber(price.amount),
    currencyText: CURRENCY_SYMBOLS[plan.currency],
    periodText: price.amount === 0 ? null : `/ ${TERM_ADVERB[price.term]}`,
    priceNote: pitch.priceNote(price.term),
    limitRows: buildPlanLimitRows(plan.limits),
    isCurrent: plan.id === overview.current.plan.id,
    action: choosePlanAction(plan, overview, today),
  };
}

export function buildPlanCards(
  overview: MerchantSubscriptionOverview,
  cycle: BillingCycle,
  today: string,
): readonly PlanCardView[] {
  return overview.plans.map((plan) => buildPlanCard(plan, overview, cycle, today));
}
