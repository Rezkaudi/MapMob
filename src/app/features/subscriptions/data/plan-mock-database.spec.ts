import { describe, expect, it } from 'vitest';
import { PlanDraft } from '../models/plan-draft';
import { MOCK_PLANS } from './plan-mock-samples';
import { PlanMockDatabase } from './plan-mock-database';

function draft(patch: Partial<PlanDraft> = {}): PlanDraft {
  return {
    name: 'الباقة الأساسية',
    isActive: true,
    monthlyPrice: 15,
    yearlyPrice: 950,
    currency: 'دولار',
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 30 },
    features: ['كل مزايا الباقة المجانية الأساسية'],
    ...patch,
  };
}

describe('PlanMockDatabase', () => {
  it('lists the seeded packages', () => {
    expect(new PlanMockDatabase(MOCK_PLANS).listPlans()).toHaveLength(3);
  });

  it('keeps an update, leaving the tier and subscribers alone', () => {
    const database = new PlanMockDatabase(MOCK_PLANS);

    const saved = database.update('basic', draft());

    expect(saved.name).toBe('الباقة الأساسية');
    expect(saved.monthlyPrice).toBe(15);
    expect(saved.tier).toBe('basic');
    expect(saved.subscriberCount).toBe(620);
    expect(database.listPlans().find((plan) => plan.id === 'basic')?.name).toBe('الباقة الأساسية');
  });

  it('refuses to update a package that is not there', () => {
    expect(() => new PlanMockDatabase(MOCK_PLANS).update('ghost', draft())).toThrow();
  });

  it('turns a package off and back on', () => {
    const database = new PlanMockDatabase(MOCK_PLANS);

    expect(database.setActive('free', false).isActive).toBe(false);
    expect(database.setActive('free', true).isActive).toBe(true);
  });

  it('drops a deleted package', () => {
    const database = new PlanMockDatabase(MOCK_PLANS);

    database.remove('free');

    expect(database.listPlans().map((plan) => plan.id)).toEqual(['basic', 'featured']);
  });

  it('summarises the packages it holds', () => {
    const summary = new PlanMockDatabase(MOCK_PLANS).summarise();

    expect(summary.availablePlanCount).toBe(3);
    expect(summary.topPlanName).toBe('أساسية');
    expect(summary.topPlanSubscriberCount).toBe(620);
  });
});
