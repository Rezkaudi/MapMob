import { toCurrencyCode } from '../../../shared/money/to-currency-code';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { LivePlan } from '../../../shared/data/live-plan';
import { toPlanTier } from '../../../shared/data/live-plan-tier';

// The server refuses an empty limit, so "unlimited" travels as this number.
const UNLIMITED_LIMIT = 9999;

function toLimit(liveLimit: number | null): number | null {
  return liveLimit === null || liveLimit >= UNLIMITED_LIMIT ? null : liveLimit;
}

function toLiveLimit(limit: number | null): number {
  return limit ?? UNLIMITED_LIMIT;
}

export function toPackagePlan(
  plan: LivePlan,
  allPlans: readonly LivePlan[],
  subscriberCount: number,
): PackagePlan {
  return {
    id: String(plan.id),
    name: plan.name,
    tier: toPlanTier(plan, allPlans),
    tagline: '',
    badge: null,
    monthlyPrice: plan.price,
    yearlyPrice: null,
    currency: toCurrencyCode(plan.currency_code),
    subscriberCount,
    limits: {
      adsPerMonth: toLimit(plan.max_ads),
      activeOffers: toLimit(plan.max_offers),
      galleryImages: toLimit(plan.max_images),
      videos: null,
    },
    features: plan.features ?? [],
    isActive: plan.is_active,
  };
}

/** The server has no yearly price or video limit, so those two are not sent. */
export function toLivePlanBody(draft: PlanDraft): Record<string, unknown> {
  return {
    name: draft.name,
    is_active: draft.isActive,
    price: draft.monthlyPrice,
    currency_code: draft.currency,
    max_ads: toLiveLimit(draft.limits.adsPerMonth),
    max_offers: toLiveLimit(draft.limits.activeOffers),
    max_images: toLiveLimit(draft.limits.galleryImages),
    features: draft.features,
  };
}
