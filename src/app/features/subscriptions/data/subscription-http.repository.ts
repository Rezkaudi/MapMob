import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionSummary } from '../models/subscription-summary';
import { LivePlan } from '../../../shared/data/live-plan';
import { toNameSlug } from '../../../shared/data/name-slug';
import { toLivePlanBody, toPackagePlan } from './live-plan-mapping';
import { LiveSubscription } from './live-subscription';
import { toSubscription } from './live-subscription-mapping';
import { LiveSubscriptionSummary } from './live-subscription-summary';
import { canServerExport, toServerExportParams } from './subscription-export-filters';
import { filterSubscriptions, querySubscriptions } from './subscription-list-query';
import { SubscriptionRepository } from './subscription.repository';
import { buildSubscriptionsCsvFile } from './subscriptions-csv';
import { summarizeLiveSubscriptions } from './summarize-live-subscriptions';

// An inactive plan may be left out of the list, so the saved one stands alone.
const NO_SUBSCRIBERS = 0;
const MONTH_DAY_COUNT = 30;
const PLAN_IN_USE_MESSAGE = 'لا يمكن حذف باقة عليها اشتراكات. ألغِ اشتراكاتها أولاً.';

interface LiveLists {
  readonly plans: readonly PackagePlan[];
  readonly subscriptions: readonly Subscription[];
}

/** The list ignores filters, so they run here; the export uses the server file when it can. */
@Injectable()
export class SubscriptionHttpRepository implements SubscriptionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly plansUrl = `${this.adminUrl}/plans`;
  private readonly subscriptionsUrl = `${this.adminUrl}/subscriptions`;

  getSummary(): Observable<SubscriptionSummary> {
    const today = toCalendarDay(this.clock());
    return forkJoin({
      counts: this.httpClient.get<LiveEnvelope<LiveSubscriptionSummary>>(
        `${this.subscriptionsUrl}/summary`,
      ),
      lists: this.loadLists(),
    }).pipe(
      map(({ counts, lists }) =>
        summarizeLiveSubscriptions(lists.plans, lists.subscriptions, counts.data, today),
      ),
    );
  }

  getPlans(): Observable<readonly PackagePlan[]> {
    return this.loadLists().pipe(map(({ plans }) => plans));
  }

  // The panel sells monthly plans, so a new plan runs for a month.
  createPlan(draft: PlanDraft): Observable<PackagePlan> {
    return this.httpClient
      .post<LiveEnvelope<LivePlan>>(this.plansUrl, {
        ...toLivePlanBody(draft),
        slug: toNameSlug(draft.name),
        duration_days: MONTH_DAY_COUNT,
      })
      .pipe(switchMap(({ data }) => this.withSubscribers(data)));
  }

  updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan> {
    return this.savePlan(id, toLivePlanBody(draft));
  }

  setPlanActive(id: string, isActive: boolean): Observable<PackagePlan> {
    return this.savePlan(id, { is_active: isActive });
  }

  // The server answers 500 when a plan still has subscriptions, so that case stops here.
  deletePlan(id: string): Observable<void> {
    return this.getPlans().pipe(
      switchMap((plans) => {
        const plan = plans.find((candidate) => candidate.id === id);
        if (plan && plan.subscriberCount > 0) {
          return throwError(() => new Error(PLAN_IN_USE_MESSAGE));
        }
        return this.httpClient.delete(`${this.plansUrl}/${id}`).pipe(map(() => undefined));
      }),
    );
  }

  cancelSubscription(id: string): Observable<void> {
    return this.httpClient.delete(`${this.subscriptionsUrl}/${id}`).pipe(map(() => undefined));
  }

  getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>> {
    return this.loadLists().pipe(
      map(({ subscriptions }) => querySubscriptions(subscriptions, query)),
    );
  }

  exportSubscriptions(query: SubscriptionQuery): Observable<Blob> {
    if (canServerExport(query)) {
      return this.httpClient.get(`${this.subscriptionsUrl}/export`, {
        params: toServerExportParams(query),
        responseType: 'blob',
      });
    }
    return this.loadLists().pipe(
      map(({ subscriptions }) =>
        buildSubscriptionsCsvFile(filterSubscriptions(subscriptions, query)),
      ),
    );
  }

  private savePlan(id: string, body: Record<string, unknown>): Observable<PackagePlan> {
    return this.httpClient
      .put<LiveEnvelope<LivePlan>>(`${this.plansUrl}/${id}`, body)
      .pipe(switchMap(({ data }) => this.withSubscribers(data)));
  }

  private withSubscribers(saved: LivePlan): Observable<PackagePlan> {
    return this.getPlans().pipe(
      map(
        (plans) =>
          plans.find((plan) => plan.id === String(saved.id)) ??
          toPackagePlan(saved, [saved], NO_SUBSCRIBERS),
      ),
    );
  }

  private loadLists(): Observable<LiveLists> {
    return forkJoin({
      plans: this.httpClient.get<LiveEnvelope<readonly LivePlan[]>>(this.plansUrl),
      subscriptions: this.httpClient.get<PagedResult<LiveSubscription>>(this.subscriptionsUrl),
    }).pipe(map(({ plans, subscriptions }) => toLiveLists(plans.data, subscriptions.items)));
  }
}

function toLiveLists(
  livePlans: readonly LivePlan[],
  liveSubscriptions: readonly LiveSubscription[],
): LiveLists {
  const subscriptions = liveSubscriptions.map((row) => toSubscription(row, livePlans));
  const activeRows = liveSubscriptions.filter((row) => row.status === 'active');
  const plans = livePlans.map((plan) =>
    toPackagePlan(plan, livePlans, activeRows.filter((row) => row.plan.id === plan.id).length),
  );
  return { plans, subscriptions };
}
