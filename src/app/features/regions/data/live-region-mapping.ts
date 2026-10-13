import { isActiveStatus, toActivationStatus } from '../../../shared/data/live-activation';
import { toNameSlug } from '../../../shared/data/name-slug';
import { Area } from '../models/area';
import { Governorate } from '../models/governorate';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { LiveCity } from './live-city';
import { LiveRegion } from './live-region';

export function toGovernorate(region: LiveRegion): Governorate {
  return {
    id: String(region.id),
    name: region.name.ar,
    subAreaCount: region.cities_count ?? 0,
    placeCount: region.stores_count ?? 0,
    status: toActivationStatus(region.is_active),
    updatedAt: region.updated_at,
  };
}

export function toArea(city: LiveCity): Area {
  return {
    id: String(city.id),
    governorateId: String(city.region_id),
    name: city.name,
    subAreaCount: 0,
    placeCount: city.stores_count ?? 0,
    status: toActivationStatus(city.is_active),
    updatedAt: city.updated_at,
  };
}

// The form has one name, and the server asks for an English one too.
export function toLiveRegionBody(draft: RegionDraft) {
  return { name: { ar: draft.name, en: draft.name }, is_active: isActiveStatus(draft.status) };
}

// The server fails without a slug on create, so the first save names one.
export function toLiveNewRegionBody(draft: RegionDraft) {
  const { name, is_active } = toLiveRegionBody(draft);
  return { name, slug: toNameSlug(draft.name), is_active };
}

export function toLiveStatusBody(status: RegionStatus) {
  return { is_active: isActiveStatus(status) };
}
