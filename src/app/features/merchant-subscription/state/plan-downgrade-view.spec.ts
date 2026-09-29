import { FREE_PLAN, buildOverview } from '../testing/merchant-subscription-fixture';
import { buildDowngradeView } from './plan-downgrade-view';

describe('plan downgrade view', () => {
  const view = buildDowngradeView(buildOverview(), FREE_PLAN, 'monthly');

  it('names the target plan throughout', () => {
    expect(view.title).toBe('الانتقال إلى الباقة المجانية');
    expect(view.description).toBe(
      'أنت على وشك الانتقال من باقتك الحالية إلى الباقة المجانية، ستتغير المزايا وحدود الاستخدام وفقاً لما هو متاح بالباقة المجانية',
    );
    expect(view.warning).toBe(
      'عند الانتقال إلى الباقة المجانية، ستفقد المزايا والحدود الإضافية المتاحة في باقتك الحالية.',
    );
    expect(view.confirmLabel).toBe('تأكيد الانتقال إلى الباقة المجانية');
  });

  it('compares the two plans limit by limit', () => {
    expect(view.current.name).toBe('الباقة الأساسية');
    expect(view.current.rows.map((row) => [row.label, row.value])).toEqual([
      ['عدد المنتجات والخدمات:', '10'],
      ['عدد الصور:', '20'],
      ['عدد العروض:', '5'],
      ['عدد الإعلانات:', '5'],
    ]);
    expect(view.target.rows.map((row) => row.value)).toEqual(['3', '5', '1', '1']);
  });

  it('greys out a limit the new plan takes away, and spells out no cap', () => {
    const noAds = { ...FREE_PLAN, limits: { ...FREE_PLAN.limits, adsPerMonth: 0, products: null } };
    const rows = buildDowngradeView(buildOverview(), noAds, 'monthly').target.rows;

    expect(rows[0]).toEqual({
      label: 'عدد المنتجات والخدمات:',
      value: 'غير محدود',
      isUnavailable: false,
    });
    expect(rows[3]).toEqual({
      label: 'عدد الإعلانات:',
      value: '0 (غير متاحة)',
      isUnavailable: true,
    });
  });

  it('asks for the free plan by the month', () => {
    expect(view.draft).toEqual({ kind: 'downgrade', planId: FREE_PLAN.id, term: 'monthly' });
  });
});
