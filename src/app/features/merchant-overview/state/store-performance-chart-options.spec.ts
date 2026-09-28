import { StorePerformance } from '../models/store-performance';
import {
  buildStorePerformanceChartOptions,
  buildStorePerformanceTooltip,
} from './store-performance-chart-options';

const PERFORMANCE: StorePerformance = {
  points: [
    { label: 'Jun', value: 180 },
    { label: 'Jul', value: 400 },
  ],
  dailyAverageViewCount: 42,
  peakDay: { on: '2026-07-24', viewCount: 142 },
};

describe('buildStorePerformanceChartOptions', () => {
  it('draws the views as one smooth wave under the month labels', () => {
    const options = buildStorePerformanceChartOptions(PERFORMANCE);

    expect(options.series).toEqual([{ name: 'المشاهدات', data: [180, 400] }]);
    expect(options.xaxis.categories).toEqual(['Jun', 'Jul']);
    expect(options.stroke.curve).toBe('smooth');
  });

  it('draws nothing before the data arrives', () => {
    expect(buildStorePerformanceChartOptions(null).series).toEqual([
      { name: 'المشاهدات', data: [] },
    ]);
  });
});

describe('buildStorePerformanceTooltip', () => {
  it('shows the label over the plain view count, with no currency sign', () => {
    const html = buildStorePerformanceTooltip('Jul', 400);

    expect(html).toContain('>Jul<');
    expect(html).toContain('>400<');
    expect(html).not.toContain('$');
  });

  it('escapes the label', () => {
    expect(buildStorePerformanceTooltip('<b>', 1)).toContain('&lt;b&gt;');
  });
});
