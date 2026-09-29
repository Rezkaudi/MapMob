import {
  CURRENT_RECORD,
  FREE_RECORD,
  buildOverview,
} from '../testing/merchant-subscription-fixture';
import { buildSubscriptionDetails } from './subscription-details';

describe('subscription details', () => {
  const plans = buildOverview().plans;

  it('fills every tile of the details dialog', () => {
    expect(buildSubscriptionDetails(CURRENT_RECORD, plans)).toEqual({
      planName: 'الباقة الأساسية',
      status: { label: 'نشطة', tone: 'success' },
      startsOnText: '01 / 09 / 2026',
      endsOnText: '01 / 10 / 2026',
      amountText: '150,000 ل.س',
      termLabel: 'شهرية',
      paymentMethodText: 'دفع نقدي',
      features: ['حتى 10 منتجات وخدمات مع الأسعار', 'حتى 20 صورة عالية الجودة للمتجر'],
    });
  });

  it('lists the features of the plan the period was on', () => {
    expect(buildSubscriptionDetails(FREE_RECORD, plans).features[0]).toBe(
      'عدد محدود من المنتجات والخدمات (حتى 3)',
    );
  });

  it('lists no features for a plan that is no longer sold', () => {
    const retired = { ...FREE_RECORD, plan: { id: 'plan-old', name: 'باقة قديمة' } };

    expect(buildSubscriptionDetails(retired, plans).features).toEqual([]);
  });
});
