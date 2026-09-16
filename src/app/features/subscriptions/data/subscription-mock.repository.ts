import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { PagedResult } from '../../../core/models/paged-result';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionSummary } from '../models/subscription-summary';
import { PlanMockDatabase } from './plan-mock-database';
import { SubscriptionMockDatabase } from './subscription-mock-database';
import { filterSubscriptions, querySubscriptions } from './subscription-mock-query';
import { SubscriptionRepository } from './subscription.repository';
import { buildSubscriptionsCsvFile } from './subscriptions-csv';

@Injectable()
export class SubscriptionMockRepository implements SubscriptionRepository {
  private readonly database = inject(PlanMockDatabase);
  private readonly subscriptions = inject(SubscriptionMockDatabase);

  getSummary(): Observable<SubscriptionSummary> {
    return mockRequest(() => this.database.summarise());
  }

  getPlans(): Observable<readonly PackagePlan[]> {
    return mockRequest(() => this.database.listPlans());
  }

  updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan> {
    return mockRequest(() => this.database.update(id, draft));
  }

  setPlanActive(id: string, isActive: boolean): Observable<PackagePlan> {
    return mockRequest(() => this.database.setActive(id, isActive));
  }

  deletePlan(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>> {
    return mockRequest(() => querySubscriptions(this.subscriptions.list(), query));
  }

  exportSubscriptions(query: SubscriptionQuery): Observable<Blob> {
    return mockRequest(() =>
      buildSubscriptionsCsvFile(filterSubscriptions(this.subscriptions.list(), query)),
    );
  }
}
