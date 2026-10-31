import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';
import { LiveOwnerPlanRequest } from './live-owner-plan-request';
import { LiveOwnerSubscriptionOverview } from './live-owner-subscription-overview';
import { toLiveRequestType } from './live-plan-request-type';
import { MerchantSubscriptionRepository } from './merchant-subscription.repository';
import { toMerchantPlans } from './to-merchant-plan';
import { isPendingRequest, toPlanChangeRequest } from './to-plan-change-request';
import { noPlanRecord, toSubscriptionRecord } from './to-subscription-record';

@Injectable()
export class MerchantSubscriptionHttpRepository implements MerchantSubscriptionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly subscriptionUrl = `${inject(API_BASE_URL)}/owner/subscription`;

  getOverview(): Observable<MerchantSubscriptionOverview> {
    return this.httpClient
      .get<LiveEnvelope<LiveOwnerSubscriptionOverview>>(this.subscriptionUrl)
      .pipe(map(({ data }) => this.toOverview(data)));
  }

  // The server keeps the term with the plan, so only the kind and the plan go.
  requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerPlanRequest>>(`${this.subscriptionUrl}/requests`, {
        requestType: toLiveRequestType(draft.kind),
        planId: draft.planId,
      })
      .pipe(map(({ data }) => toPlanChangeRequest(data)));
  }

  private toOverview(live: LiveOwnerSubscriptionOverview): MerchantSubscriptionOverview {
    const pending = live.requests.find(isPendingRequest);
    return {
      current: live.current
        ? toSubscriptionRecord(live.current)
        : noPlanRecord(toCalendarDay(this.clock())),
      usage: {
        products: live.usage.productsAndServices,
        galleryImages: live.usage.media,
        activeOffers: live.usage.offers,
        adsThisMonth: live.usage.ads,
      },
      plans: toMerchantPlans(live.availablePlans),
      history: live.history.map(toSubscriptionRecord),
      pendingRequest: pending ? toPlanChangeRequest(pending) : null,
    };
  }
}
