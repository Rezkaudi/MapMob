import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';
import { MerchantOverviewRepository } from './merchant-overview.repository';

@Injectable()
export class MerchantOverviewHttpRepository implements MerchantOverviewRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getOverview(): Observable<MerchantOverview> {
    return this.httpClient.get<MerchantOverview>(`${this.apiBaseUrl}/owner/overview`);
  }

  getPerformance(period: ChartPeriod): Observable<StorePerformance> {
    return this.httpClient.get<StorePerformance>(`${this.apiBaseUrl}/owner/overview/performance`, {
      params: { period },
    });
  }
}
