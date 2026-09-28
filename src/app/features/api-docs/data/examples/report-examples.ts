export const CATEGORY_SHARES = [
  { category: { id: '2', name: 'مطاعم' }, placeCount: 132, sharePercent: 32 },
  { category: { id: '5', name: 'صيدليات' }, placeCount: 74, sharePercent: 18 },
];

export const GOVERNORATE_ACTIVITY = [
  { governorate: { id: '1', name: 'دمشق' }, visitCount: 48210, sharePercent: 41 },
  { governorate: { id: '3', name: 'حلب' }, visitCount: 21950, sharePercent: 19 },
];

export const USER_GROWTH = [
  {
    key: 'newUsers',
    name: 'مستخدمون جدد',
    points: [
      { periodStart: '2026-08-01', value: 214 },
      { periodStart: '2026-09-01', value: 260 },
    ],
  },
  {
    key: 'activeUsers',
    name: 'مستخدمون نشطون',
    points: [
      { periodStart: '2026-08-01', value: 1830 },
      { periodStart: '2026-09-01', value: 2010 },
    ],
  },
];

export const USAGE_METRICS = [
  { key: 'search', label: 'عمليات البحث', count: 18420, sharePercent: 52 },
  { key: 'placeView', label: 'زيارات الأماكن', count: 10930, sharePercent: 30 },
  { key: 'favorite', label: 'الإضافة للمفضلة', count: 6210, sharePercent: 18 },
];

export const REPORT_REVENUE = {
  name: 'الإيرادات',
  currency: 'SYP',
  points: [{ periodStart: '2026-09-01', value: 320000 }],
};
