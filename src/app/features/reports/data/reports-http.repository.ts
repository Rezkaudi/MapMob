import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { UsageMetric } from '../models/usage-metric';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsHttpRepository implements ReportsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getCategoryShares(): Observable<readonly CategoryShare[]> {
    return this.httpClient.get<readonly CategoryShare[]>(
      `${this.apiBaseUrl}/reports/category-shares`,
    );
  }

  getGovernorateActivities(): Observable<readonly GovernorateActivity[]> {
    return this.httpClient.get<readonly GovernorateActivity[]>(
      `${this.apiBaseUrl}/reports/governorate-activity`,
    );
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return this.httpClient.get<readonly ChartSeries[]>(`${this.apiBaseUrl}/reports/user-growth`, {
      params: { period },
    });
  }

  getUsageMetrics(period: ChartPeriod): Observable<readonly UsageMetric[]> {
    return this.httpClient.get<readonly UsageMetric[]>(`${this.apiBaseUrl}/reports/usage`, {
      params: { period },
    });
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return this.httpClient.get<ChartSeries>(`${this.apiBaseUrl}/reports/revenue`, {
      params: { period },
    });
  }
}
