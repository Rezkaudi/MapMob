import { Observable } from 'rxjs';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { UsageMetric } from '../models/usage-metric';

export abstract class ReportsRepository {
  abstract getCategoryShares(): Observable<readonly CategoryShare[]>;
  abstract getGovernorateActivities(): Observable<readonly GovernorateActivity[]>;
  /** Active users first, new users second. */
  abstract getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]>;
  abstract getUsageMetrics(period: ChartPeriod): Observable<readonly UsageMetric[]>;
  abstract getRevenueSeries(period: ChartPeriod): Observable<ChartSeries>;
}
