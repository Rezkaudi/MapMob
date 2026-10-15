import { chartPointLabel } from './chart-point-label';

describe('chartPointLabel', () => {
  it('shows day and month for daily and weekly points', () => {
    expect(chartPointLabel('2026-09-07', 'daily')).toBe('07/09');
    expect(chartPointLabel('2026-09-07', 'weekly')).toBe('07/09');
  });

  it('shows the Arabic month name for monthly points', () => {
    expect(chartPointLabel('2026-09-01', 'monthly')).toBe('سبتمبر');
  });

  it('shows the year for yearly points', () => {
    expect(chartPointLabel('2026-01-01', 'yearly')).toBe('2026');
  });
});
