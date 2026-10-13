import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { ActionItem } from '../models/action-item';
import { DashboardSummary } from '../models/dashboard-summary';
import { RecentPlace } from '../models/recent-place';
import { chartPointLabel } from './chart-point-label';
import { DashboardRepository } from './dashboard.repository';
import {
  LiveActionItem,
  LiveChartSeries,
  LiveDashboardSummary,
  LiveRecentPlace,
} from './live-dashboard-response';

const PLACES_SERIES_KEY = 'places';

@Injectable()
export class DashboardHttpRepository implements DashboardRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly dashboardUrl = `${inject(API_BASE_URL)}/admin/dashboard`;

  getSummary(): Observable<DashboardSummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveDashboardSummary>>(`${this.dashboardUrl}/summary`)
      .pipe(map(({ data }) => ({ ...data, revenue: data.revenue.amount })));
  }

  getActionItems(): Observable<readonly ActionItem[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveActionItem[]>>(`${this.dashboardUrl}/action-items`)
      .pipe(map(({ data }) => data));
  }

  getRecentPlaces(): Observable<readonly RecentPlace[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveRecentPlace[]>>(`${this.dashboardUrl}/recent-places`)
      .pipe(map(({ data }) => data.map(toRecentPlace)));
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return this.httpClient
      .get<LiveEnvelope<LiveChartSeries>>(`${this.dashboardUrl}/revenue`, { params: { period } })
      .pipe(map(({ data }) => toChartSeries(data, period)));
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveChartSeries[]>>(`${this.dashboardUrl}/growth`, {
        params: { period },
      })
      .pipe(map(({ data }) => placesFirst(data).map((series) => toChartSeries(series, period))));
  }
}

function toRecentPlace(place: LiveRecentPlace): RecentPlace {
  return {
    id: place.id,
    name: place.name,
    category: place.category?.name ?? '',
    city: place.governorate?.name ?? '',
    rating: place.rating,
    status: place.status,
    joinedAt: place.createdAt,
    logoUrl: place.logoUrl,
  };
}

function toChartSeries(series: LiveChartSeries, period: ChartPeriod): ChartSeries {
  return {
    name: series.name,
    points: series.points.map((point) => ({
      label: chartPointLabel(point.periodStart, period),
      value: point.value,
    })),
  };
}

function placesFirst(series: readonly LiveChartSeries[]): readonly LiveChartSeries[] {
  return [...series].sort(
    (first, second) =>
      Number(second.key === PLACES_SERIES_KEY) - Number(first.key === PLACES_SERIES_KEY),
  );
}
