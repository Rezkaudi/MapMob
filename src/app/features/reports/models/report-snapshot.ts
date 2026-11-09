import { ChartSeries } from '../../../shared/models/chart-series';
import { CategoryShare } from './category-share';
import { GovernorateActivity } from './governorate-activity';
import { UsageMetric } from './usage-metric';

/** Every figure the reports page is showing right now. */
export interface ReportSnapshot {
  readonly categoryShares: readonly CategoryShare[];
  readonly usageMetrics: readonly UsageMetric[];
  readonly governorateActivities: readonly GovernorateActivity[];
  readonly growthSeries: readonly ChartSeries[];
  readonly revenueSeries: ChartSeries | null;
}
