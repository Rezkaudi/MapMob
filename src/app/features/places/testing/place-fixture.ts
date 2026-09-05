import { Place } from '../models/place';

/** A single filled-in place, so specs only spell out the field they care about. */
export function createPlace(overrides: Partial<Place> = {}): Place {
  return {
    id: 'place-1',
    code: '1024',
    name: 'صيدلية الحياة',
    logoUrl: '',
    category: 'صيدلية',
    city: 'الرياض',
    rating: 4.9,
    status: 'active',
    package: 'basic',
    joinedAt: '2024-01-12T00:00:00.000Z',
    ...overrides,
  };
}
