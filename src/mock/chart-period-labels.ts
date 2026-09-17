import { ChartPeriod } from '../app/shared/models/chart-period';

export const CHART_PERIOD_LABELS: Record<ChartPeriod, readonly string[]> = {
  daily: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yearly: ['2021', '2022', '2023', '2024', '2025'],
};
