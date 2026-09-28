import { ChartSeriesPoint } from '../../../shared/models/chart-series';

export interface PeakViewDay {
  /** yyyy-mm-dd */
  readonly on: string;
  readonly viewCount: number;
}

/** The "أداء المتجر والمشاهدات" card for one period tab. */
export interface StorePerformance {
  readonly points: readonly ChartSeriesPoint[];
  readonly dailyAverageViewCount: number;
  /** Null while the store has no views in the period. */
  readonly peakDay: PeakViewDay | null;
}
