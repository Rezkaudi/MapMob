import { toLivePlaceStatus, toPlace, toPlacePackage, toPlaceStatus } from './live-place-mapping';

const LIVE_ROW = {
  id: '4',
  code: 'PL-0004',
  name: 'happy store',
  publicUrl: 'https://api.test/store/happy_store',
  logoUrl: 'https://api.test/logo.jpg',
  category: { id: '1', name: 'مطاعم' },
  governorate: { id: '1', name: 'دمشق' },
  rating: 4.2,
  reviewCount: 3,
  status: 'inactive',
  planTier: 'free',
  createdAt: '2026-10-03T19:59:36Z',
};

describe('live place mapping', () => {
  it('turns a server row into a table row', () => {
    expect(toPlace(LIVE_ROW)).toEqual({
      id: '4',
      code: 'PL-0004',
      name: 'happy store',
      publicUrl: 'https://api.test/store/happy_store',
      logoUrl: 'https://api.test/logo.jpg',
      category: 'مطاعم',
      city: 'دمشق',
      rating: 4.2,
      status: 'suspended',
      package: 'free',
      joinedAt: '2026-10-03T19:59:36Z',
    });
  });

  it('reads the server word "inactive" as suspended and sends it back the same way', () => {
    expect(toPlaceStatus('inactive')).toBe('suspended');
    expect(toPlaceStatus('suspended')).toBe('suspended');
    expect(toPlaceStatus('pending')).toBe('pending');
    expect(toLivePlaceStatus('suspended')).toBe('inactive');
    expect(toLivePlaceStatus('active')).toBe('active');
  });

  it('reads the plan tier, treating any other paid plan as basic', () => {
    expect(toPlacePackage('free')).toBe('free');
    expect(toPlacePackage(null)).toBe('free');
    expect(toPlacePackage('featured')).toBe('premium');
    expect(toPlacePackage('golden-plan')).toBe('basic');
  });
});
