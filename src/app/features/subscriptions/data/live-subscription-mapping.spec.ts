import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LIVE_SUBSCRIPTION } from '../testing/live-subscription-fixture';
import { toSubscription, toSubscriptionStatus } from './live-subscription-mapping';

describe('live subscription mapping', () => {
  it('reads a subscription row with calendar days and the plan tier', () => {
    expect(toSubscription(LIVE_SUBSCRIPTION, [LIVE_GOLD_PLAN])).toEqual({
      id: '7',
      companyName: 'متجر دمشق',
      planName: 'الباقة الذهبية',
      planTier: 'featured',
      price: 150000,
      currencySymbol: 'ل.س',
      startedOn: '2026-10-04',
      endsOn: '2026-11-03',
      status: 'active',
    });
  });

  it('reads expired as expired and every other stop as paused', () => {
    expect(toSubscriptionStatus('active')).toBe('active');
    expect(toSubscriptionStatus('expired')).toBe('expired');
    expect(toSubscriptionStatus('cancelled')).toBe('paused');
  });
});
