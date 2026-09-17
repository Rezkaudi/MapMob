import { ChartPeriod } from '../../../shared/models/chart-period';

/** A card with period tabs: the chosen tab, what it shows, and whether that is reloading. */
export interface PeriodChartState<TData> {
  readonly period: ChartPeriod;
  readonly data: TData;
  readonly isLoading: boolean;
}
