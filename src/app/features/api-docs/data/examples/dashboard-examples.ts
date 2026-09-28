import { PLACE_ROW } from './place-examples';

export const DASHBOARD_SUMMARY = {
  revenue: { amount: 4820000, currency: 'SYP' },
  pendingPlaceCount: 7,
  placeCount: 412,
  newPlaceCount: 18,
  userCount: 9630,
  newUserCount: 214,
};

export const ACTION_ITEMS = [
  { id: 'places-pending', label: 'أماكن بانتظار الموافقة', count: 12, tone: 'warning' },
  { id: 'reviews-reported', label: 'تقييمات مبلغ عنها', count: 3, tone: 'error' },
  { id: 'subscriptions-ending', label: 'اشتراكات تنتهي هذا الأسبوع', count: 5, tone: 'info' },
];

export const RECENT_PLACES = [
  { ...PLACE_ROW, id: '402', code: 'PL-0402', name: 'مطعم الشام', status: 'pending' },
];

export const REVENUE_SERIES = {
  name: 'الإيرادات',
  currency: 'SYP',
  points: [
    { periodStart: '2026-07-01', value: 320000 },
    { periodStart: '2026-08-01', value: 415000 },
    { periodStart: '2026-09-01', value: 390000 },
  ],
};

export const GROWTH_SERIES = [
  {
    key: 'users',
    name: 'المستخدمون',
    points: [
      { periodStart: '2026-08-01', value: 820 },
      { periodStart: '2026-09-01', value: 910 },
    ],
  },
  {
    key: 'places',
    name: 'الأماكن',
    points: [
      { periodStart: '2026-08-01', value: 46 },
      { periodStart: '2026-09-01', value: 52 },
    ],
  },
];
