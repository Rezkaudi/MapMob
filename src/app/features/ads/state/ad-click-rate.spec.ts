import { formatAdClickRate } from './ad-click-rate';

describe('formatAdClickRate', () => {
  it('writes the share of views that were clicked to two decimals', () => {
    expect(formatAdClickRate({ impressions: 48250, clicks: 3860, uniqueUsers: 34120 })).toBe(
      '8.00%',
    );
  });

  it('reads zero for an ad nobody has seen yet, instead of dividing by zero', () => {
    expect(formatAdClickRate({ impressions: 0, clicks: 0, uniqueUsers: 0 })).toBe('0.00%');
  });
});
