import { ChartSeries } from '../../../shared/models/chart-series';
import { buildGrowthChartOptions } from './growth-chart-options';

const ACTIVE_USERS: ChartSeries = {
  name: 'المستخدمون النشطون',
  points: [
    { label: 'Mon', value: 34 },
    { label: 'Tue', value: 102 },
  ],
};
const NEW_USERS: ChartSeries = {
  name: 'المستخدمون الجدد',
  points: [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 72 },
  ],
};

describe('buildGrowthChartOptions', () => {
  const options = buildGrowthChartOptions([ACTIVE_USERS, NEW_USERS]);

  it('draws active users under new users so the blue area sits on top', () => {
    expect(options.series).toEqual([
      { name: 'المستخدمون النشطون', data: [34, 102] },
      { name: 'المستخدمون الجدد', data: [12, 72] },
    ]);
    expect(options.colors).toEqual(['#f59e0b', '#0583ec']);
  });

  it('labels the time axis with the point labels', () => {
    expect(options.xaxis.categories).toEqual(['Mon', 'Tue']);
  });

  it('draws straight lines over areas tinted at 15%', () => {
    expect(options.chart.type).toBe('area');
    expect(options.stroke.curve).toBe('straight');
    expect(options.fill).toEqual({ type: 'solid', opacity: 0.15 });
  });

  it('gives active users hollow dots and new users solid ones', () => {
    expect(options.markers.colors).toEqual(['#ffffff', '#0583ec']);
    expect(options.markers.strokeColors).toEqual(['#f59e0b', '#0583ec']);
  });

  it('scales the value axis from zero to a round top', () => {
    expect(options.yaxis).toMatchObject({ min: 0, max: 120, tickAmount: 4 });
  });

  it('draws nothing but an empty frame before the data arrives', () => {
    const empty = buildGrowthChartOptions([]);

    expect(empty.series).toEqual([]);
    expect(empty.xaxis.categories).toEqual([]);
  });
});
