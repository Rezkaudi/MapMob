import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ActionItem } from '../models/action-item';
import { ChartSeries } from '../models/chart-point';
import { DashboardSummary } from '../models/dashboard-summary';
import { RecentPlace } from '../models/recent-place';
import { ChartPeriod, DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardHttpRepository implements DashboardRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getSummary(): Observable<DashboardSummary> {
    return this.httpClient.get<DashboardSummary>(`${this.apiBaseUrl}/dashboard/summary`);
  }

  getActionItems(): Observable<readonly ActionItem[]> {
    return this.httpClient.get<readonly ActionItem[]>(`${this.apiBaseUrl}/dashboard/action-items`);
  }

  getRecentPlaces(): Observable<readonly RecentPlace[]> {
    return this.httpClient.get<readonly RecentPlace[]>(
      `${this.apiBaseUrl}/dashboard/recent-places`,
    );
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return this.httpClient.get<ChartSeries>(`${this.apiBaseUrl}/dashboard/revenue`, {
      params: { period },
    });
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return this.httpClient.get<readonly ChartSeries[]>(`${this.apiBaseUrl}/dashboard/growth`, {
      params: { period },
    });
  }
}
