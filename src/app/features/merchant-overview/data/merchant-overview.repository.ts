import { Observable } from 'rxjs';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';

export abstract class MerchantOverviewRepository {
  abstract getOverview(): Observable<MerchantOverview>;
  abstract getPerformance(period: ChartPeriod): Observable<StorePerformance>;
}
