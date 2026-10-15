import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveChartSeries } from '../../../shared/data/live-chart-series';
import { toChartSeries } from '../../../shared/data/to-chart-series';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { UsageMetric } from '../models/usage-metric';
import { LiveCategoryShare } from './live-category-share';
import { LiveGovernorateActivity } from './live-governorate-activity';
import { LiveUsageMetric } from './live-usage-metric';
import { ReportsRepository } from './reports.repository';

const ACTIVE_USERS_KEY = 'activeUsers';

@Injectable()
export class ReportsHttpRepository implements ReportsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly reportsUrl = `${inject(API_BASE_URL)}/admin/reports`;

  getCategoryShares(): Observable<readonly CategoryShare[]> {
    return this.httpClient
      .get<readonly LiveCategoryShare[]>(`${this.reportsUrl}/categoryshares`)
      .pipe(
        map((rows) =>
          rows.map((row) => ({ categoryName: row.category.name, share: row.sharePercent })),
        ),
      );
  }

  getGovernorateActivities(): Observable<readonly GovernorateActivity[]> {
    return this.httpClient
      .get<readonly LiveGovernorateActivity[]>(`${this.reportsUrl}/governorateactivity`)
      .pipe(
        map((rows) =>
          rows.map((row) => ({
            governorateName: row.governorate.name,
            visitCount: row.visitCount,
            share: row.sharePercent,
          })),
        ),
      );
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return this.httpClient
      .get<readonly LiveChartSeries[]>(`${this.reportsUrl}/user-growth`, { params: { period } })
      .pipe(
        map((series) =>
          [...series]
            .sort(
              (first, second) =>
                Number(second.key === ACTIVE_USERS_KEY) - Number(first.key === ACTIVE_USERS_KEY),
            )
            .map((line) => toChartSeries(line, period)),
        ),
      );
  }

  getUsageMetrics(period: ChartPeriod): Observable<readonly UsageMetric[]> {
    return this.httpClient
      .get<readonly LiveUsageMetric[]>(`${this.reportsUrl}/usage`, { params: { period } })
      .pipe(
        map((rows) =>
          rows.map((row) => ({ label: row.label, count: row.count, share: row.sharePercent })),
        ),
      );
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return this.httpClient
      .get<LiveChartSeries>(`${this.reportsUrl}/revenue`, { params: { period } })
      .pipe(map((series) => toChartSeries(series, period)));
  }
}
