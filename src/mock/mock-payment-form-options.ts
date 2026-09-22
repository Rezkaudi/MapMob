import { PaymentFormOptions } from '../app/features/payments/models/payment-form-options';
import { PaymentMerchant } from '../app/features/payments/models/payment-merchant';
import { PaymentPlan } from '../app/features/payments/models/payment-plan';
import { MOCK_PLACES } from './mock-places';

/**
 * Prices are in Syrian pounds, the currency the "إضافة دفعة جديدة" frame draws. The free plan
 * is left out: a payment is always for a paid one.
 */
const PLANS: readonly PaymentPlan[] = [
  { id: 'basic', name: 'الباقة الأساسية', monthlyPrice: 150000, yearlyPrice: 1440000 },
  { id: 'featured', name: 'الباقة المميزة', monthlyPrice: 300000, yearlyPrice: 2880000 },
];

/** Every third store is still on the free plan, so all three payment kinds have a subject. */
const CURRENT_PLAN_IDS = ['basic', 'featured', 'free'] as const;
const PLAN_END_DAYS = ['2026-08-17', '2026-11-02', null] as const;

function buildMerchants(): readonly PaymentMerchant[] {
  return MOCK_PLACES.map((place, index) => {
    const planId = CURRENT_PLAN_IDS[index % CURRENT_PLAN_IDS.length];
    const plan = PLANS.find((candidate) => candidate.id === planId) ?? null;
    const isSubscribed = planId !== 'free';
    return {
      id: place.id,
      name: place.name,
      currentPlanId: isSubscribed ? planId : null,
      currentPlanName: isSubscribed ? (plan?.name ?? null) : null,
      subscriptionEndsOn: PLAN_END_DAYS[index % PLAN_END_DAYS.length],
      currency: 'SYP',
    };
  });
}

export const MOCK_PAYMENT_FORM_OPTIONS: PaymentFormOptions = {
  merchants: buildMerchants(),
  plans: PLANS,
};
