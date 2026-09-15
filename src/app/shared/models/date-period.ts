export type DatePeriod = 'all' | 'today' | 'last7Days' | 'last30Days' | 'custom';

export const DATE_PERIOD_LABEL: Record<DatePeriod, string> = {
  all: 'الكل',
  today: 'اليوم',
  last7Days: 'آخر 7 أيام',
  last30Days: 'آخر 30 يوم',
  custom: 'نطاق مخصص',
};
