import { FEATURED_PLAN, buildOverview } from '../testing/merchant-subscription-fixture';
import { buildRenewalRequest, buildUpgradeRequest } from './plan-request-view';

describe('plan request view', () => {
  const overview = buildOverview();

  it('sums up an upgrade with the new plan in blue', () => {
    const view = buildUpgradeRequest(overview, FEATURED_PLAN, 'monthly');

    expect(view.title).toBe('طلب ترقية الباقة');
    expect(view.rows).toEqual([
      {
        label: 'الباقة الحالية',
        value: 'الباقة الأساسية (150,000 ل.س / شهرياً)',
        isHighlighted: false,
      },
      { label: 'الباقة الجديدة المطلوبة', value: 'الباقة المميزة', isHighlighted: true },
      { label: 'قيمة الاشتراك', value: '300,000 ل.س / شهرياً', isHighlighted: false },
      { label: 'طريقة الدفع', value: 'دفع نقدي', isHighlighted: false },
    ]);
    expect(view.draft).toEqual({ kind: 'upgrade', planId: FEATURED_PLAN.id, term: 'monthly' });
  });

  it('prices an upgrade by the year when the yearly cycle is picked', () => {
    const view = buildUpgradeRequest(overview, FEATURED_PLAN, 'yearly');

    expect(view.rows[2].value).toBe('2,880,000 ل.س / سنوياً');
    expect(view.draft.term).toBe('yearly');
  });

  it("renews the current plan for its own term at today's price", () => {
    const view = buildRenewalRequest(overview);

    expect(view.title).toBe('طلب تجديد الاشتراك');
    expect(view.rows.map((row) => row.value)).toEqual([
      'الباقة الأساسية (150,000 ل.س / شهرياً)',
      'شهري',
      '150,000 ل.س / شهرياً',
      'دفع نقدي',
    ]);
    expect(view.rows[1].label).toBe('مدة التجديد');
    expect(view.draft).toEqual({ kind: 'renewal', planId: 'plan-basic', term: 'monthly' });
  });
});
