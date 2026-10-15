import { chartPointLabel } from '../formatting/chart-point-label';
import { ChartPeriod } from '../models/chart-period';
import { ChartSeries } from '../models/chart-series';
import { LiveChartSeries } from './live-chart-series';

export function toChartSeries(series: LiveChartSeries, period: ChartPeriod): ChartSeries {
  return {
    name: series.name,
    points: series.points.map((point) => ({
      label: chartPointLabel(point.periodStart, period),
      value: point.value,
    })),
  };
}
