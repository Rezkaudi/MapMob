import { toUsageMetricRows } from './usage-metric-rows';

describe('toUsageMetricRows', () => {
  it('formats the count and share of each metric', () => {
    const [row] = toUsageMetricRows([
      { label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 },
    ]);

    expect(row).toEqual({
      label: 'عمليات البحث والاستكشاف',
      valueText: '24,150',
      shareText: '(42%)',
      share: 42,
      tone: 'blue',
    });
  });

  it('colours the rows blue, green, amber, red in the design order, then starts again', () => {
    const metrics = Array.from({ length: 5 }, (_, index) => ({
      label: `${index}`,
      count: 1,
      share: 1,
    }));

    expect(toUsageMetricRows(metrics).map((row) => row.tone)).toEqual([
      'blue',
      'green',
      'amber',
      'red',
      'blue',
    ]);
  });
});
