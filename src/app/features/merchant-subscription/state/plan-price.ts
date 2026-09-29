import { BillingCycle } from '../../../shared/models/billing-cycle';
import { MerchantPlan } from '../models/merchant-plan';
import { PlanPrice } from '../models/plan-price';

export function priceForCycle(plan: MerchantPlan, cycle: BillingCycle): PlanPrice {
  if (cycle === 'yearly' && plan.yearlyPrice !== null) {
    return { amount: plan.yearlyPrice, term: 'yearly' };
  }
  return { amount: plan.monthlyPrice, term: 'monthly' };
}
