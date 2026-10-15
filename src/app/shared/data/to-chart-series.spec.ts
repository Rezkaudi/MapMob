import { toChartSeries } from './to-chart-series';

describe('toChartSeries', () => {
  it('keeps the name and labels each point for the period', () => {
    expect(
      toChartSeries(
        { key: 'revenue', name: 'الإيرادات', points: [{ periodStart: '2026-09-01', value: 1000 }] },
        'yearly',
      ),
    ).toEqual({ name: 'الإيرادات', points: [{ label: '2026', value: 1000 }] });
  });
});
