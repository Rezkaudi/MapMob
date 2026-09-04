import { Observable } from 'rxjs';
import { ActionItem } from '../models/action-item';
import { ChartSeries } from '../models/chart-point';
import { DashboardSummary } from '../models/dashboard-summary';
import { RecentPlace } from '../models/recent-place';

export type ChartPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export abstract class DashboardRepository {
  abstract getSummary(): Observable<DashboardSummary>;
  abstract getActionItems(): Observable<readonly ActionItem[]>;
  abstract getRecentPlaces(): Observable<readonly RecentPlace[]>;
  abstract getRevenueSeries(period: ChartPeriod): Observable<ChartSeries>;
  abstract getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]>;
}
