import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mockResponse } from '../../../../mock/mock-delay';
import { createSeededRandom, randomInt } from '../../../../mock/random';
import { ActionItem } from '../models/action-item';
import { ChartSeries } from '../models/chart-point';
import { DashboardSummary } from '../models/dashboard-summary';
import { RecentPlace } from '../models/recent-place';
import { ChartPeriod, DashboardRepository } from './dashboard.repository';

const SUMMARY: DashboardSummary = {
  revenue: 23000,
  pendingReviewCount: 73,
  placeCount: 3000,
  newPlaceCount: 20,
  userCount: 173000,
  newUserCount: 320,
};

const ACTION_ITEMS: readonly ActionItem[] = [
  { id: 'complaints', label: 'بلاغ جديد', count: 12, tone: 'error' },
  { id: 'reported-reviews', label: 'تقييمات مبلغ عنها', count: 8, tone: 'warning' },
  { id: 'pending-places', label: 'متجر بانتظار الموافقة', count: 37, tone: 'info' },
  { id: 'expiring-subscriptions', label: 'اشتراكات تنتهي قريباً', count: 5, tone: 'success' },
];

const RECENT_PLACES: readonly RecentPlace[] = Array.from({ length: 4 }, (_, i) => ({
  id: `place-${i + 1}`,
  name: 'صيدلية الحياة',
  category: 'صيدلية',
  city: 'الرياض',
  rating: 4.9,
  status: (['active', 'suspended', 'active', 'pending'] as const)[i],
  joinedAt: '2024-01-12',
}));

const PERIOD_LABELS: Record<ChartPeriod, readonly string[]> = {
  daily: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  weekly: ['W1', 'W2', 'W3', 'W4'],
  monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yearly: ['2021', '2022', '2023', '2024', '2025'],
};

function buildSeries(
  seed: number,
  name: string,
  period: ChartPeriod,
  min: number,
  max: number,
): ChartSeries {
  const next = createSeededRandom(seed);
  const labels = PERIOD_LABELS[period];
  return {
    name,
    points: labels.map((label) => ({ label, value: randomInt(next, min, max) })),
  };
}

@Injectable()
export class DashboardMockRepository implements DashboardRepository {
  getSummary(): Observable<DashboardSummary> {
    return mockResponse(SUMMARY);
  }

  getActionItems(): Observable<readonly ActionItem[]> {
    return mockResponse(ACTION_ITEMS);
  }

  getRecentPlaces(): Observable<readonly RecentPlace[]> {
    return mockResponse(RECENT_PLACES);
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return mockResponse(buildSeries(1, 'الإيرادات', period, 10, 60));
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return mockResponse([
      buildSeries(2, 'الشركات', period, 20, 100),
      buildSeries(3, 'المستخدمون', period, 20, 150),
    ]);
  }
}
