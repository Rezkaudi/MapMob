import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';
import { MerchantSubscriptionRepository } from './merchant-subscription.repository';

@Injectable()
export class MerchantSubscriptionHttpRepository implements MerchantSubscriptionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly subscriptionUrl = `${inject(API_BASE_URL)}/owner/subscription`;

  getOverview(): Observable<MerchantSubscriptionOverview> {
    return this.httpClient.get<MerchantSubscriptionOverview>(this.subscriptionUrl);
  }

  requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest> {
    return this.httpClient.post<PlanChangeRequest>(`${this.subscriptionUrl}/requests`, draft);
  }
}
