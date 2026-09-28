import type { Area } from '../../../regions/models/area';
import type { Governorate } from '../../../regions/models/governorate';
import type { RegionDraft } from '../../../regions/models/region-draft';

export const GOVERNORATE_ROW = {
  id: '1',
  name: 'محافظة دمشق',
  subAreaCount: 8,
  placeCount: 126,
  status: 'active',
  updatedAt: '2026-09-22T19:01:23Z',
} satisfies Governorate;

export const AREA_ROW = {
  id: '2',
  governorateId: '1',
  name: 'المزة',
  subAreaCount: 0,
  placeCount: 31,
  status: 'active',
  updatedAt: '2026-09-22T19:01:39Z',
} satisfies Area;

export const REGION_DRAFT = { name: 'محافظة دمشق', status: 'active' } satisfies RegionDraft;

export const AREA_DRAFT = { name: 'المزة', status: 'active' } satisfies RegionDraft;
