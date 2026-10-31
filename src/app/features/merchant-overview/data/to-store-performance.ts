import { chartPointLabel } from '../../../shared/formatting/chart-point-label';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { StorePerformance } from '../models/store-performance';
import { LiveOwnerPerformance } from './live-owner-performance';
import { ownerPeriodDay } from './owner-period-day';

export const EMPTY_STORE_PERFORMANCE: StorePerformance = {
  points: [],
  dailyAverageViewCount: 0,
  peakDay: null,
};

export function toStorePerformance(
  performance: LiveOwnerPerformance,
  period: ChartPeriod,
): StorePerformance {
  const top = performance.topDay;
  return {
    points: performance.points.map((point) => ({
      label: chartPointLabel(ownerPeriodDay(point.periodStart, period), period),
      value: point.views,
    })),
    dailyAverageViewCount: performance.averageViews,
    peakDay: top?.views
      ? { on: ownerPeriodDay(top.periodStart, period), viewCount: top.views }
      : null,
  };
}
