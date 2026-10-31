import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';
import { LiveOwnerCurrentSubscription } from './live-owner-current-subscription';
import { LiveOwnerInteraction } from './live-owner-interaction';
import { LiveOwnerPerformance } from './live-owner-performance';
import { LiveOwnerReview } from '../../../shared/data/live-owner-review';
import { LiveOwnerSummary } from './live-owner-summary';
import { MerchantOverviewRepository } from './merchant-overview.repository';
import { toMerchantOverview } from './to-merchant-overview';
import { EMPTY_STORE_PERFORMANCE, toStorePerformance } from './to-store-performance';

// The server refuses period=daily (422).
const UNSUPPORTED_PERIOD: ChartPeriod = 'daily';

@Injectable()
export class MerchantOverviewHttpRepository implements MerchantOverviewRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly overviewUrl = `${inject(API_BASE_URL)}/owner/overview`;

  getOverview(): Observable<MerchantOverview> {
    return forkJoin({
      summary: this.read<LiveOwnerSummary>('summary'),
      interactions: this.read<{ items: LiveOwnerInteraction[] }>('interactions').pipe(
        map(({ items }) => items),
      ),
      reviews: this.read<{ reviews: LiveOwnerReview[] }>('reviews').pipe(
        map(({ reviews }) => reviews),
      ),
      subscription: this.read<{ current: LiveOwnerCurrentSubscription | null }>(
        'subscription',
      ).pipe(map(({ current }) => current)),
    }).pipe(map(toMerchantOverview));
  }

  getPerformance(period: ChartPeriod): Observable<StorePerformance> {
    if (period === UNSUPPORTED_PERIOD) {
      return of(EMPTY_STORE_PERFORMANCE);
    }
    return this.httpClient
      .get<LiveEnvelope<LiveOwnerPerformance>>(`${this.overviewUrl}/performance`, {
        params: { period },
      })
      .pipe(map(({ data }) => toStorePerformance(data, period)));
  }

  private read<TData>(part: string): Observable<TData> {
    return this.httpClient
      .get<LiveEnvelope<TData>>(`${this.overviewUrl}/${part}`)
      .pipe(map(({ data }) => data));
  }
}
