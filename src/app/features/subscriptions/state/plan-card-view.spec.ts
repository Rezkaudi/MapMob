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
    currency: 'USD',
    subscriberCount: 620,
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 5, activeStories: 3 },
    features: ['كل مزايا الباقة المجانية'],
    isActive: true,
    ...patch,
  };
}

describe('buildPlanCardView', () => {
  it('prices a paid plan as amount, currency and period', () => {
    const view = buildPlanCardView(plan());

    expect(view.price).toEqual({ amount: '20', currency: '$', period: '/ شهرياً' });
  });

  it('prices a paid plan by the year when the yearly cycle is picked', () => {
    const view = buildPlanCardView(plan(), 'yearly');

    expect(view.price).toEqual({ amount: '192', currency: '$', period: '/ سنوياً' });
  });

  it('keeps the monthly price when a plan has no yearly one', () => {
    const view = buildPlanCardView(plan({ yearlyPrice: null }), 'yearly');

    expect(view.price).toEqual({ amount: '20', currency: '$', period: '/ شهرياً' });
  });

  it('stays free on the yearly cycle', () => {
    const view = buildPlanCardView(plan({ tier: 'free', monthlyPrice: 0 }), 'yearly');

    expect(view.price).toEqual({ amount: 'مجاناً', currency: null, period: '/ دائماً' });
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

  it('lists the three shared limit rows, then the stories cap', () => {
    const rows = buildPlanCardView(plan()).limitRows;

    expect(rows).toHaveLength(4);
    expect(rows[3]).toEqual({ label: 'القصص النشطة:', value: '3 قصص' });
  });

  it('shows an unlimited stories cap as unlimited', () => {
    const limits = { ...plan().limits, activeStories: null };

    expect(buildPlanCardView(plan({ limits })).limitRows[3].value).toBe('غير محدود ⚡');
  });
});
