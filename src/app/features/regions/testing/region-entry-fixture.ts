import { Area } from '../models/area';
import { Governorate } from '../models/governorate';

export function buildGovernorate(overrides: Partial<Governorate> = {}): Governorate {
  return {
    id: 'governorate-1',
    name: 'طرطوس',
    subAreaCount: 5,
    placeCount: 1200,
    status: 'active',
    updatedAt: '2024-01-12T00:00:00.000Z',
    ...overrides,
  };
}

export function buildArea(overrides: Partial<Area> = {}): Area {
  return {
    id: 'area-1',
    governorateId: 'governorate-1',
    name: 'صافيتا',
    subAreaCount: 5,
    placeCount: 1200,
    status: 'active',
    updatedAt: '2024-01-12T00:00:00.000Z',
    ...overrides,
  };
}
