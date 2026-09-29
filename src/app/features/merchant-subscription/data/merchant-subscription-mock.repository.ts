import { Injectable, inject } from '@angular/core';
import { Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';
import type { MerchantSubscriptionMockDatabase } from './merchant-subscription-mock-database';
import { MerchantSubscriptionRepository } from './merchant-subscription.repository';

@Injectable()
export class MerchantSubscriptionMockRepository implements MerchantSubscriptionRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(import('./merchant-subscription-mock-database')).pipe(
    map((module) => new module.MerchantSubscriptionMockDatabase(this.clock)),
    shareReplay(1),
  );

  getOverview(): Observable<MerchantSubscriptionOverview> {
    return this.run((database) => database.readOverview());
  }

  requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest> {
    return this.run((database) => database.addRequest(draft));
  }

  private run<T>(work: (database: MerchantSubscriptionMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
