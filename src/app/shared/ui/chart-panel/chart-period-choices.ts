import { ChartPeriodOption } from './chart-period-option';

/** RTL puts the first tab on the right, so each list reads from short to long. */
export const DAY_TO_MONTH_PERIODS: readonly ChartPeriodOption[] = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
];

export const WEEK_TO_YEAR_PERIODS: readonly ChartPeriodOption[] = [
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
  { value: 'yearly', label: 'سنوي' },
];
