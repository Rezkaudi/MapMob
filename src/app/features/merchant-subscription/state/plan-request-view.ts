import { BillingCycle } from '../../../shared/models/billing-cycle';
import { MerchantPlan } from '../models/merchant-plan';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanRequestRow, PlanRequestView } from '../models/plan-request-view';
import { PAYMENT_METHOD_SHORT } from './payment-method-words';
import { priceForCycle } from './plan-price';
import { formatPricePerTerm } from './price-per-term';
import { RENEWAL_TERM_LABEL } from './term-words';

// Plan changes are always settled in cash with the MapMob team.
const PAYMENT_ROW: PlanRequestRow = {
  label: 'طريقة الدفع',
  value: PAYMENT_METHOD_SHORT.cash,
  isHighlighted: false,
};

function describeCurrentPlan({ current }: MerchantSubscriptionOverview): PlanRequestRow {
  const price = formatPricePerTerm(current.price.amount, current.price.currency, current.term);
  return {
    label: 'الباقة الحالية',
    value: `${current.plan.name} (${price})`,
    isHighlighted: false,
  };
}

function describePrice(plan: MerchantPlan, cycle: BillingCycle): PlanRequestRow {
  const price = priceForCycle(plan, cycle);
  return {
    label: 'قيمة الاشتراك',
    value: formatPricePerTerm(price.amount, plan.currency, price.term),
    isHighlighted: false,
  };
}

export function buildUpgradeRequest(
  overview: MerchantSubscriptionOverview,
  plan: MerchantPlan,
  cycle: BillingCycle,
): PlanRequestView {
  return {
    title: 'طلب ترقية الباقة',
    rows: [
      describeCurrentPlan(overview),
      { label: 'الباقة الجديدة المطلوبة', value: plan.name, isHighlighted: true },
      describePrice(plan, cycle),
      PAYMENT_ROW,
    ],
    draft: { kind: 'upgrade', planId: plan.id, term: priceForCycle(plan, cycle).term },
  };
}

/** Renews for the same term, at the plan's price today rather than the price paid last time. */
export function buildRenewalRequest(overview: MerchantSubscriptionOverview): PlanRequestView {
  const { current } = overview;
  const plan = overview.plans.find((candidate) => candidate.id === current.plan.id);
  const priceRow = plan
    ? describePrice(plan, current.term)
    : {
        label: 'قيمة الاشتراك',
        value: formatPricePerTerm(current.price.amount, current.price.currency, current.term),
        isHighlighted: false,
      };
  return {
    title: 'طلب تجديد الاشتراك',
    rows: [
      describeCurrentPlan(overview),
      { label: 'مدة التجديد', value: RENEWAL_TERM_LABEL[current.term], isHighlighted: false },
      priceRow,
      PAYMENT_ROW,
    ],
    draft: { kind: 'renewal', planId: current.plan.id, term: current.term },
  };
}
