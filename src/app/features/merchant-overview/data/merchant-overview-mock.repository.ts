import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { mockResponse } from '../../../../mock/mock-delay';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';
import { MerchantOverviewRepository } from './merchant-overview.repository';

// Loaded on first use, so the seed stays out of the initial bundle.
const loadSeed = () => from(import('./merchant-overview-mock-seed'));

@Injectable()
export class MerchantOverviewMockRepository implements MerchantOverviewRepository {
  getOverview(): Observable<MerchantOverview> {
    return loadSeed().pipe(switchMap((seed) => mockResponse(seed.MERCHANT_OVERVIEW_SEED)));
  }

  getPerformance(period: ChartPeriod): Observable<StorePerformance> {
    return loadSeed().pipe(
      switchMap((seed) => mockResponse(seed.buildStorePerformanceSeed(period))),
    );
  }
}
