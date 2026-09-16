import { formatAdPeriod } from './ad-period-label';

describe('formatAdPeriod', () => {
  it('writes both days joined by "حتى", as the table does', () => {
    expect(formatAdPeriod('2024-01-12', '2024-01-26')).toBe('١٢ يناير ٢٠٢٤ حتى ٢٦ يناير ٢٠٢٤');
  });

  it('marks an ad without a last day as ongoing', () => {
    expect(formatAdPeriod('2024-01-12', null)).toBe('من ١٢ يناير ٢٠٢٤ (دائم)');
  });
});
