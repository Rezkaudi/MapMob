import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import {
  toLivePlaceStatus,
  toLivePlanSlug,
  toPlace,
  toPlacePackage,
  toPlaceStatus,
} from './live-place-mapping';

const LIVE_SILVER_PLAN = { ...LIVE_GOLD_PLAN, id: 3, slug: 'silver', price: 50000 };
const PLANS = [LIVE_GOLD_PLAN, LIVE_SILVER_PLAN];

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
    expect(toPlace(LIVE_ROW, PLANS)).toEqual({
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

  it('reads the plan slug as a package by its price among the plans', () => {
    expect(toPlacePackage('free', PLANS)).toBe('free');
    expect(toPlacePackage(null, PLANS)).toBe('free');
    expect(toPlacePackage('golden-plan', PLANS)).toBe('premium');
    expect(toPlacePackage('silver', PLANS)).toBe('basic');
    expect(toPlacePackage('gone-plan', PLANS)).toBe('basic');
  });

  it('turns a package filter into the slug of a plan of that level', () => {
    expect(toLivePlanSlug('free', PLANS)).toBe('free');
    expect(toLivePlanSlug('premium', PLANS)).toBe('golden-plan');
    expect(toLivePlanSlug('basic', PLANS)).toBe('silver');
    expect(toLivePlanSlug('basic', [LIVE_GOLD_PLAN])).toBe('basic');
  });
});
