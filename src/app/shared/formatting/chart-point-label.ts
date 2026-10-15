import { ChartPeriod } from '../models/chart-period';

const MONTH_NAME = new Intl.DateTimeFormat('ar', { month: 'long', timeZone: 'UTC' });

/** `periodStart` is a `yyyy-mm-dd` day; the label says only what the period needs. */
export function chartPointLabel(periodStart: string, period: ChartPeriod): string {
  const [year, month, day] = periodStart.split('-');
  if (period === 'yearly') {
    return year;
  }
  if (period === 'monthly') {
    return MONTH_NAME.format(new Date(`${periodStart}T00:00:00Z`));
  }
  return `${day}/${month}`;
}
