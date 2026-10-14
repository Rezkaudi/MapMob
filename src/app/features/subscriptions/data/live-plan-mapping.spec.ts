import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LivePlan } from '../../../shared/data/live-plan';
import { toLivePlanBody, toPackagePlan } from './live-plan-mapping';

const LIVE_FREE_PLAN: LivePlan = { ...LIVE_GOLD_PLAN, id: 2, slug: 'free', price: 0 };
const LIVE_SILVER_PLAN: LivePlan = { ...LIVE_GOLD_PLAN, id: 3, slug: 'silver', price: 50000 };
const ALL_PLANS = [LIVE_GOLD_PLAN, LIVE_FREE_PLAN, LIVE_SILVER_PLAN];

describe('live plan mapping', () => {
  it('reads a plan as a card, counting its subscribers', () => {
    expect(toPackagePlan(LIVE_GOLD_PLAN, ALL_PLANS, 4)).toEqual({
      id: '1',
      name: 'الباقة الذهبية',
      tier: 'featured',
      tagline: '',
      badge: null,
      monthlyPrice: 150000,
      yearlyPrice: null,
      currency: 'SYP',
      subscriberCount: 4,
      limits: { adsPerMonth: 10, activeOffers: 5, galleryImages: 20, videos: null },
      features: ['دعم فني'],
      isActive: true,
    });
  });

  it('reads an unknown currency as the Syrian pound and no features as an empty list', () => {
    const plan = toPackagePlan(
      { ...LIVE_GOLD_PLAN, currency_code: 'EUR', features: null },
      ALL_PLANS,
      0,
    );

    expect(plan.currency).toBe('SYP');
    expect(plan.features).toEqual([]);
  });

  it('reads the unlimited marker as no limit', () => {
    const plan = toPackagePlan({ ...LIVE_GOLD_PLAN, max_ads: 9999 }, [LIVE_GOLD_PLAN], 0);

    expect(plan.limits.adsPerMonth).toBeNull();
  });

  it('writes a draft in the server field names', () => {
    expect(
      toLivePlanBody({
        name: 'فضية',
        isActive: false,
        monthlyPrice: 900,
        yearlyPrice: 9000,
        currency: 'USD',
        limits: { adsPerMonth: 1, activeOffers: null, galleryImages: 3, videos: 2 },
        features: ['أ'],
      }),
    ).toEqual({
      name: 'فضية',
      is_active: false,
      price: 900,
      currency_code: 'USD',
      max_ads: 1,
      max_offers: 9999,
      max_images: 3,
      features: ['أ'],
    });
  });
});
