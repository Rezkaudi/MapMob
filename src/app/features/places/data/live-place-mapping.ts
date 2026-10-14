import { LivePlan } from '../../../shared/data/live-plan';
import { toPlanTier } from '../../../shared/data/live-plan-tier';
import { PlanTier } from '../../../shared/models/plan-tier';
import { Place } from '../models/place';
import { PlacePackage } from '../models/place-package';
import { PlaceStatus } from '../models/place-status';
import { LivePlaceRow } from './live-place-row';

// The server rejects "suspended" when saving and keeps a suspended place as "inactive".
const LIVE_SUSPENDED = 'inactive';
const FREE_PLAN_SLUG = 'free';

export function toPlaceStatus(liveStatus: string): PlaceStatus {
  if (liveStatus === 'active' || liveStatus === 'pending') {
    return liveStatus;
  }
  return 'suspended';
}

export function toLivePlaceStatus(status: PlaceStatus): string {
  return status === 'suspended' ? LIVE_SUSPENDED : status;
}

const PACKAGE_OF_TIER: Record<PlanTier, PlacePackage> = {
  free: 'free',
  basic: 'basic',
  featured: 'premium',
};

/** The server sends a plan slug; its level comes from the plan's price among all plans. */
export function toPlacePackage(slug: string | null, plans: readonly LivePlan[]): PlacePackage {
  if (!slug || slug === FREE_PLAN_SLUG) {
    return 'free';
  }
  const plan = plans.find((candidate) => candidate.slug === slug);
  return plan ? PACKAGE_OF_TIER[toPlanTier(plan, plans)] : 'basic';
}

/** The filter takes one slug, so a level with several plans filters by the first. */
export function toLivePlanSlug(placePackage: PlacePackage, plans: readonly LivePlan[]): string {
  if (placePackage === 'free') {
    return FREE_PLAN_SLUG;
  }
  const plan = plans.find(
    (candidate) =>
      candidate.price > 0 && PACKAGE_OF_TIER[toPlanTier(candidate, plans)] === placePackage,
  );
  return plan?.slug ?? placePackage;
}

export function toPlace(row: LivePlaceRow, plans: readonly LivePlan[]): Place {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    publicUrl: row.publicUrl ?? '',
    logoUrl: row.logoUrl ?? '',
    category: row.category?.name ?? '',
    city: row.governorate?.name ?? '',
    rating: row.rating,
    status: toPlaceStatus(row.status),
    package: toPlacePackage(row.planTier, plans),
    joinedAt: row.createdAt,
  };
}
