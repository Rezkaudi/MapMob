import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { PagedResult } from '../../../core/models/paged-result';
import { LivePlan } from '../../../shared/data/live-plan';
import { toNameSlug } from '../../../shared/data/name-slug';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionSummary } from '../models/subscription-summary';
import { toLivePlanBody, toPackagePlan } from './live-plan-mapping';
import { LiveSubscription } from './live-subscription';
import { toSubscription } from './live-subscription-mapping';
import { LiveSubscriptionSummary } from './live-subscription-summary';
import { toSubscriptionFilterParams } from './subscription-query-params';
import { SubscriptionRepository } from './subscription.repository';
import { summarizeLiveSubscriptions } from './summarize-live-subscriptions';

const MONTH_DAY_COUNT = 30;

@Injectable()
export class SubscriptionHttpRepository implements SubscriptionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly plansUrl = `${this.adminUrl}/plans`;
  private readonly subscriptionsUrl = `${this.adminUrl}/subscriptions`;

  getSummary(): Observable<SubscriptionSummary> {
    return forkJoin({
      counts: this.httpClient.get<LiveEnvelope<LiveSubscriptionSummary>>(
        `${this.subscriptionsUrl}/summary`,
      ),
      plans: this.getPlans(),
    }).pipe(map(({ counts, plans }) => summarizeLiveSubscriptions(plans, counts.data)));
  }

  getPlans(): Observable<readonly PackagePlan[]> {
    return this.readLivePlans().pipe(
      map((plans) => plans.map((plan) => toPackagePlan(plan, plans))),
    );
  }

  // The panel sells monthly plans, so a new plan runs for a month.
  createPlan(draft: PlanDraft): Observable<PackagePlan> {
    return this.httpClient
      .post<LiveEnvelope<LivePlan>>(this.plansUrl, {
        ...toLivePlanBody(draft),
        slug: toNameSlug(draft.name),
        duration_days: MONTH_DAY_COUNT,
      })
      .pipe(switchMap(({ data }) => this.withPlanList(data)));
  }

  updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan> {
    return this.savePlan(id, toLivePlanBody(draft));
  }

  setPlanActive(id: string, isActive: boolean): Observable<PackagePlan> {
    return this.savePlan(id, { is_active: isActive });
  }

  deletePlan(id: string): Observable<void> {
    return this.httpClient.delete(`${this.plansUrl}/${id}`).pipe(map(() => undefined));
  }

  cancelSubscription(id: string): Observable<void> {
    return this.httpClient.delete(`${this.subscriptionsUrl}/${id}`).pipe(map(() => undefined));
  }

  // Rows name their plan by id, so the plans give each row its tier.
  getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>> {
    return this.readLivePlans().pipe(
      switchMap((plans) =>
        this.httpClient
          .get<PagedResult<LiveSubscription>>(this.subscriptionsUrl, {
            params: withPageNumber(toSubscriptionFilterParams(query), query),
          })
          .pipe(
            map((page) => ({
              items: page.items.map((row) => toSubscription(row, plans)),
              totalCount: page.totalCount,
            })),
          ),
      ),
    );
  }

  exportSubscriptions(query: SubscriptionQuery): Observable<Blob> {
    return this.httpClient.get(`${this.subscriptionsUrl}/export`, {
      params: toSubscriptionFilterParams(query),
      responseType: 'blob',
    });
  }

  private savePlan(id: string, body: Record<string, unknown>): Observable<PackagePlan> {
    return this.httpClient
      .put<LiveEnvelope<LivePlan>>(`${this.plansUrl}/${id}`, body)
      .pipe(switchMap(({ data }) => this.withPlanList(data)));
  }

  // An inactive plan may be left out of the list, so the saved one stands alone.
  private withPlanList(saved: LivePlan): Observable<PackagePlan> {
    return this.getPlans().pipe(
      map(
        (plans) =>
          plans.find((plan) => plan.id === String(saved.id)) ?? toPackagePlan(saved, [saved]),
      ),
    );
  }

  private readLivePlans(): Observable<readonly LivePlan[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LivePlan[]>>(this.plansUrl)
      .pipe(map(({ data }) => data));
  }
}
