import { describe, expect, it } from 'vitest';
import { NO_SUBSCRIPTION_FILTERS } from '../models/subscription-filters';
import { countActiveSubscriptionFilters } from './count-active-subscription-filters';

describe('countActiveSubscriptionFilters', () => {
  it('counts nothing when no filter is set', () => {
    expect(countActiveSubscriptionFilters(NO_SUBSCRIPTION_FILTERS)).toBe(0);
  });

  it('counts the tier and the status separately', () => {
    const count = countActiveSubscriptionFilters({
      ...NO_SUBSCRIPTION_FILTERS,
      tier: 'basic',
      status: 'active',
    });

    expect(count).toBe(2);
  });

  it('counts a date range once, however many ends it has', () => {
    const oneEnd = countActiveSubscriptionFilters({
      ...NO_SUBSCRIPTION_FILTERS,
      subscribedRange: { from: '2026-08-01', to: null },
    });
    const bothEnds = countActiveSubscriptionFilters({
      ...NO_SUBSCRIPTION_FILTERS,
      subscribedRange: { from: '2026-08-01', to: '2026-09-02' },
    });

    expect(oneEnd).toBe(1);
    expect(bothEnds).toBe(1);
  });
});
