import { ChartSeries } from '../../../shared/models/chart-series';
import { buildRevenueChartOptions, buildRevenueTooltip } from './revenue-chart-options';

const REVENUE: ChartSeries = {
  name: 'الإيرادات',
  points: [
    { label: 'Jun', value: 10900 },
    { label: 'Jul', value: 48200 },
  ],
};

describe('buildRevenueChartOptions', () => {
  const options = buildRevenueChartOptions(REVENUE);

  it('draws one smooth blue wave', () => {
    expect(options.series).toEqual([{ name: 'الإيرادات', data: [10900, 48200] }]);
    expect(options.stroke.curve).toBe('smooth');
    expect(options.colors).toEqual(['#0583ec']);
  });

  it('shows no value axis, only dashed month rules', () => {
    expect(options.yaxis).toMatchObject({ show: false });
    expect(options.grid).toMatchObject({
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    });
  });

  it('leaves a quarter of headroom above the highest point, so the wave floats as drawn', () => {
    expect(options.yaxis).toMatchObject({ min: 0, max: (48200 * 4) / 3 });
  });

  it('writes the months in Lato 14px, as the design does', () => {
    expect(options.xaxis.categories).toEqual(['Jun', 'Jul']);
    expect(options.xaxis.labels?.style).toMatchObject({ fontFamily: 'Lato', fontSize: '14px' });
  });

  it('draws nothing before the data arrives', () => {
    expect(buildRevenueChartOptions(null).series).toEqual([{ name: '', data: [] }]);
  });
});

describe('buildRevenueTooltip', () => {
  it('shows the point label over the amount in dollars', () => {
    const html = buildRevenueTooltip('Jul', 48200);

    expect(html).toContain('Jul');
    expect(html).toContain('$48,200');
  });

  it('never lets a label inject markup', () => {
    expect(buildRevenueTooltip('<img src=x>', 1)).not.toContain('<img');
  });
});
