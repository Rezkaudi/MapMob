import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionSummary } from '../models/subscription-summary';

export abstract class SubscriptionRepository {
  abstract getSummary(): Observable<SubscriptionSummary>;
  abstract getPlans(): Observable<readonly PackagePlan[]>;
  abstract updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan>;
  abstract setPlanActive(id: string, isActive: boolean): Observable<PackagePlan>;
  abstract deletePlan(id: string): Observable<void>;
  abstract getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>>;
  /** Every subscription matching the filters, not just one page. */
  abstract exportSubscriptions(query: SubscriptionQuery): Observable<Blob>;
}
