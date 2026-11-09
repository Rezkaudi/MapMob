import { buildReportsCsvText } from './reports-csv';

describe('buildReportsCsvText', () => {
  const text = buildReportsCsvText({
    categoryShares: [{ categoryName: 'مطاعم', share: 29 }],
    usageMetrics: [{ label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 }],
    governorateActivities: [{ governorateName: 'دمشق', visitCount: 16750, share: 32 }],
    growthSeries: [{ name: 'المستخدمون الجدد', points: [{ label: 'Mon', value: 12 }] }],
    revenueSeries: { name: 'الإيرادات', points: [{ label: 'Jul', value: 48200 }] },
  });
  const lines = text.split('\r\n');

  it('starts with a header row', () => {
    expect(lines[0]).toBe('القسم,البند,القيمة,النسبة');
  });

  it('writes one row per figure shown on the page, under its card title', () => {
    expect(lines.slice(1)).toEqual([
      'الشركات والمتاجر حسب التصنيف,مطاعم,,29%',
      'نشاط المستخدمين و سلوك الاستخدام,عمليات البحث والاستكشاف,24150,42%',
      'النشاط حسب الموقع الجغرافي,دمشق,16750,32%',
      'نمو المستخدمين و التفاعل,المستخدمون الجدد - Mon,12,',
      'الإيرادات,Jul,48200,',
    ]);
  });
});
