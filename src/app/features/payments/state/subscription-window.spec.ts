import { buildSubscriptionWindow } from './subscription-window';

describe('buildSubscriptionWindow', () => {
  it('runs a monthly term to the same day of the next month', () => {
    expect(buildSubscriptionWindow('2026-09-17', 'monthly')).toEqual({
      startsOn: '2026-09-17',
      endsOn: '2026-10-17',
    });
  });

  it('runs a yearly term to the same day of the next year', () => {
    expect(buildSubscriptionWindow('2026-09-17', 'yearly')).toEqual({
      startsOn: '2026-09-17',
      endsOn: '2027-09-17',
    });
  });

  it('rolls a monthly term over the end of the year', () => {
    expect(buildSubscriptionWindow('2026-12-31', 'monthly').endsOn).toBe('2027-01-31');
  });

  it('keeps a short month from spilling into the next one', () => {
    expect(buildSubscriptionWindow('2026-01-31', 'monthly').endsOn).toBe('2026-02-28');
  });

  it('keeps a leap day from spilling into March', () => {
    expect(buildSubscriptionWindow('2024-02-29', 'yearly').endsOn).toBe('2025-02-28');
  });
});
