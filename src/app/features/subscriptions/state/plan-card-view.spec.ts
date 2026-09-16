import { describe, expect, it } from 'vitest';
import { PackagePlan } from '../models/package-plan';
import { buildPlanCardView } from './plan-card-view';

function plan(patch: Partial<PackagePlan> = {}): PackagePlan {
  return {
    id: 'basic',
    name: 'أساسية',
    tier: 'basic',
    tagline: 'الباقة المثلى للمتاجر المتوسطة',
    badge: 'الأكثر مبيعاً',
    monthlyPrice: 20,
    yearlyPrice: 192,
    currency: 'دولار',
    subscriberCount: 620,
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 5 },
    features: ['كل مزايا الباقة المجانية'],
    isActive: true,
    ...patch,
  };
}

describe('buildPlanCardView', () => {
  it('prices a paid plan as amount, currency and period', () => {
    const view = buildPlanCardView(plan());

    expect(view.price).toEqual({ amount: '20', currency: 'دولار', period: '/ شهرياً' });
  });

  it('prices a free plan as "مجاناً" with no currency and a forever period', () => {
    const view = buildPlanCardView(plan({ tier: 'free', monthlyPrice: 0 }));

    expect(view.price).toEqual({ amount: 'مجاناً', currency: null, period: '/ دائماً' });
  });

  it('counts subscribed stores under the price', () => {
    expect(buildPlanCardView(plan()).subscriberLine).toBe('620 متجر مشترك حالياً');
  });

  it('calls the featured tier subscribers premium companies', () => {
    const view = buildPlanCardView(plan({ tier: 'featured', subscriberCount: 210 }));

    expect(view.subscriberLine).toBe('210 شركات مميزة مشتركة');
  });

  it('carries the three limit rows the card lists', () => {
    expect(buildPlanCardView(plan()).limitRows).toHaveLength(3);
  });
});
