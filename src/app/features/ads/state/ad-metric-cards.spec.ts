import { buildAdMetricCards } from './ad-metric-cards';

const METRICS = { impressions: 48250, clicks: 3860, uniqueUsers: 34120 };

describe('buildAdMetricCards', () => {
  it('builds the four cards in the order the grid draws them', () => {
    expect(buildAdMetricCards(METRICS)).toEqual([
      { kind: 'impressions', label: 'مرات الظهور', value: '48,250', suffix: '' },
      { kind: 'clicks', label: 'عدد النقرات', value: '3,860', suffix: '' },
      { kind: 'clickRate', label: 'نسبة النقر (CTR)', value: '8.00%', suffix: '' },
      { kind: 'uniqueUsers', label: 'المستخدمون', value: '34,120', suffix: 'مستمع / مشاهد' },
    ]);
  });
});
