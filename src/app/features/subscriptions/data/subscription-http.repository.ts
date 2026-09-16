import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionSummary } from '../models/subscription-summary';
import { toSubscriptionQueryParams } from './subscription-query-params';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionHttpRepository implements SubscriptionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getSummary(): Observable<SubscriptionSummary> {
    return this.httpClient.get<SubscriptionSummary>(`${this.apiBaseUrl}/subscriptions/summary`);
  }

  getPlans(): Observable<readonly PackagePlan[]> {
    return this.httpClient.get<readonly PackagePlan[]>(`${this.apiBaseUrl}/subscription-plans`);
  }

  updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan> {
    return this.httpClient.put<PackagePlan>(`${this.apiBaseUrl}/subscription-plans/${id}`, draft);
  }

  setPlanActive(id: string, isActive: boolean): Observable<PackagePlan> {
    return this.httpClient.patch<PackagePlan>(`${this.apiBaseUrl}/subscription-plans/${id}`, {
      isActive,
    });
  }

  deletePlan(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiBaseUrl}/subscription-plans/${id}`);
  }

  getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>> {
    return this.httpClient.get<PagedResult<Subscription>>(`${this.apiBaseUrl}/subscriptions`, {
      params: toSubscriptionQueryParams(query),
    });
  }

  exportSubscriptions(query: SubscriptionQuery): Observable<Blob> {
    return this.httpClient.get(`${this.apiBaseUrl}/subscriptions/export`, {
      params: toSubscriptionQueryParams(query),
      responseType: 'blob',
    });
  }
}
