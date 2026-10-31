import { toPlanTier } from '../../../shared/data/live-plan-tier';
import { MerchantPlan } from '../models/merchant-plan';
import { LiveOwnerPlan } from './live-owner-plan';
import { toBillingCycle, toCurrencyCode } from './to-subscription-record';

const MONTHS_IN_YEAR = 12;

/** Cheapest first, as the page lists them. */
export function toMerchantPlans(plans: readonly LiveOwnerPlan[]): MerchantPlan[] {
  return [...plans]
    .sort((first, second) => first.price - second.price)
    .map((plan) => toMerchantPlan(plan, plans));
}

// The server caps pictures and videos together, so both rows show the one number.
function toMerchantPlan(plan: LiveOwnerPlan, allPlans: readonly LiveOwnerPlan[]): MerchantPlan {
  const isYearly = toBillingCycle(plan.billingCycle) === 'yearly';
  return {
    id: String(plan.id),
    name: plan.name,
    tier: toPlanTier(plan, allPlans),
    tagline: '',
    monthlyPrice: isYearly ? Math.round(plan.price / MONTHS_IN_YEAR) : plan.price,
    yearlyPrice: isYearly ? plan.price : null,
    currency: toCurrencyCode(plan.currencyCode),
    limits: {
      products: plan.maxProducts,
      adsPerMonth: plan.maxAds,
      activeOffers: plan.maxOffers,
      galleryImages: plan.maxImages,
      videos: plan.maxImages,
    },
    features: plan.features ?? [],
  };
}
