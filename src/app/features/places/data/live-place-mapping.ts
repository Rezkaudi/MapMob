import { Place } from '../models/place';
import { PlacePackage } from '../models/place-package';
import { PlaceStatus } from '../models/place-status';
import { LivePlaceRow } from './live-place-row';

// The server rejects "suspended" when saving and keeps a suspended place as "inactive".
const LIVE_SUSPENDED = 'inactive';
const FREE_TIER = 'free';
const FEATURED_TIER = 'featured';

export function toPlaceStatus(liveStatus: string): PlaceStatus {
  if (liveStatus === 'active' || liveStatus === 'pending') {
    return liveStatus;
  }
  return 'suspended';
}

export function toLivePlaceStatus(status: PlaceStatus): string {
  return status === 'suspended' ? LIVE_SUSPENDED : status;
}

/** The server sends a plan slug here; only free and featured have a fixed meaning yet. */
export function toPlacePackage(tier: string | null): PlacePackage {
  if (!tier || tier === FREE_TIER) {
    return 'free';
  }
  return tier === FEATURED_TIER ? 'premium' : 'basic';
}

export function toPlace(row: LivePlaceRow): Place {
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
    package: toPlacePackage(row.planTier),
    joinedAt: row.createdAt,
  };
}
