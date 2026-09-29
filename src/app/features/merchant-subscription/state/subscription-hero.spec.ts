import { CURRENT_RECORD, buildOverview } from '../testing/merchant-subscription-fixture';
import { buildSubscriptionHero } from './subscription-hero';

describe('subscription hero', () => {
  const hero = buildSubscriptionHero(buildOverview());

  it('names the plan, its status and what it costs per period', () => {
    expect(hero.planName).toBe('الباقة الأساسية');
    expect(hero.status).toEqual({ label: 'نشطة', tone: 'success' });
    expect(hero.amountText).toBe('150,000');
    expect(hero.periodText).toBe('ل.س / شهرياً');
  });

  it('writes the dates spaced out and the payment in full', () => {
    expect(hero.startsOnText).toBe('01 / 09 / 2026');
    expect(hero.endsOnText).toBe('01 / 10 / 2026');
    expect(hero.paymentMethodText).toBe('الدفع النقدي المباشر');
  });

  it('points the upgrade button at the next tier up', () => {
    expect(hero.upgradeTarget?.name).toBe('الباقة المميزة');
    expect(hero.canUpgrade).toBe(true);
  });

  it('locks the upgrade while a request waits', () => {
    const waiting = buildSubscriptionHero(
      buildOverview({
        pendingRequest: {
          id: 'request-1',
          kind: 'renewal',
          plan: CURRENT_RECORD.plan,
          term: 'monthly',
          status: 'pending',
          createdAt: '2026-09-28T08:00:00Z',
        },
      }),
    );

    expect(waiting.canUpgrade).toBe(false);
  });

  it('reads an ended period as ended', () => {
    const ended = buildSubscriptionHero(
      buildOverview({ current: { ...CURRENT_RECORD, status: 'expired' } }),
    );

    expect(ended.status).toEqual({ label: 'منتهية', tone: 'muted' });
  });
});
