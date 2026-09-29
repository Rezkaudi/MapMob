import {
  BASIC_PLAN,
  FEATURED_PLAN,
  FREE_PLAN,
  buildOverview,
} from '../testing/merchant-subscription-fixture';
import { buildPlanCards } from './plan-cards';

const TODAY = '2026-09-10';

describe('plan cards', () => {
  const [free, basic, featured] = buildPlanCards(buildOverview(), 'monthly', TODAY);

  it('keeps the cheapest first, so RTL puts the free plan on the right', () => {
    expect([free.plan.id, basic.plan.id, featured.plan.id]).toEqual([
      FREE_PLAN.id,
      BASIC_PLAN.id,
      FEATURED_PLAN.id,
    ]);
  });

  it('gives each tier its line above the name', () => {
    expect([free.eyebrow, basic.eyebrow, featured.eyebrow]).toEqual([
      'بداية تجريبية',
      'الأكثر ملاءمة',
      'أقصى وصول وتأثير',
    ]);
  });

  it('prices a paid plan by the month with grouped digits', () => {
    expect(basic.amountText).toBe('150,000');
    expect(basic.currencyText).toBe('ل.س');
    expect(basic.periodText).toBe('/ شهرياً');
    expect(basic.priceNote).toBe('تجدد شهرياً بالدفع النقدي المعتمد');
  });

  it('prices the free plan as 0 with no period', () => {
    expect(free.amountText).toBe('0');
    expect(free.periodText).toBeNull();
    expect(free.priceNote).toBe('مجانية دائماً بدون رسوم دورية');
  });

  it('switches paid plans to the yearly price and wording', () => {
    const [, yearlyBasic] = buildPlanCards(buildOverview(), 'yearly', TODAY);

    expect(yearlyBasic.amountText).toBe('1,440,000');
    expect(yearlyBasic.periodText).toBe('/ سنوياً');
    expect(yearlyBasic.priceNote).toBe('تجدد سنوياً بالدفع النقدي المعتمد');
  });

  it('lists the ads, offers and pictures limits', () => {
    expect(featured.limitRows.map((row) => row.value)).toEqual([
      'غير محدود ⚡',
      'غير محدود ⚡',
      '100 صورة',
    ]);
  });

  it('marks only the plan the place is on as current', () => {
    expect([free.isCurrent, basic.isCurrent, featured.isCurrent]).toEqual([false, true, false]);
    expect(basic.action.kind).toBe('current');
  });
});
