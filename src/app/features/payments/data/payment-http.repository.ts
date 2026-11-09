import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { LivePaginationPage } from '../../../core/http/live-pagination-page';
import { PagedResult } from '../../../core/models/paged-result';
import { LivePlan } from '../../../shared/data/live-plan';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { Payment } from '../models/payment';
import { PaymentChanges } from '../models/payment-changes';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { LivePayment } from './live-payment';
import {
  toLivePaymentBody,
  toLivePaymentChangesBody,
  toLiveSubscriptionBody,
  toPayment,
  toPaymentDetail,
  toPaymentFormOptions,
} from './live-payment-mapping';
import { LiveOfferStoreOptions } from './live-offer-store-options';
import { LivePaymentStore } from './live-payment-store';
import { LivePaymentSubscription } from './live-payment-subscription';
import { LivePaymentSummary } from './live-payment-summary';
import { toPaymentFilterParams } from './payment-query-params';
import { PaymentRepository } from './payment.repository';

const YEAR_MONTH_LENGTH = 7;
const FIRST_DAY_OF_MONTH = '01';

interface LiveItems<T> {
  readonly items: readonly T[];
}

@Injectable()
export class PaymentHttpRepository implements PaymentRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly paymentsUrl = `${this.adminUrl}/payments`;

  getPayments(query: PaymentQuery): Observable<PagedResult<Payment>> {
    return this.httpClient
      .get<LivePaginationPage<LivePayment>>(this.paymentsUrl, {
        params: withPageNumber(toPaymentFilterParams(query), query),
      })
      .pipe(map((page) => ({ items: page.data.map(toPayment), totalCount: page.pagination.total })));
  }

  getSummary(): Observable<PaymentSummary> {
    const monthStart = `${toCalendarDay(this.clock()).slice(0, YEAR_MONTH_LENGTH)}-${FIRST_DAY_OF_MONTH}`;
    return forkJoin({
      allTime: this.readSummary(),
      thisMonth: this.readSummary(monthStart),
    }).pipe(
      map(({ allTime, thisMonth }) => ({
        transactionCount: allTime.total_count,
        pendingCount: allTime.pending_count,
        cumulativeTotal: Number(allTime.total_amount),
        monthTotal: Number(thisMonth.total_amount),
      })),
    );
  }

  getPaymentDetail(id: string): Observable<PaymentDetail> {
    return this.httpClient.get<LiveEnvelope<LivePayment>>(`${this.paymentsUrl}/${id}`).pipe(
      switchMap(({ data }) =>
        forkJoin({
          store: this.readOrNull<LivePaymentStore>(`${this.adminUrl}/stores/${data.store.id}`),
          subscription: data.subscription_id
            ? this.readOrNull<LivePaymentSubscription>(
                `${this.adminUrl}/subscriptions/${data.subscription_id}`,
              )
            : of(null),
        }).pipe(map(({ store, subscription }) => toPaymentDetail(data, store, subscription))),
      ),
    );
  }

  getPaymentFormOptions(): Observable<PaymentFormOptions> {
    return forkJoin({
      storeOptions: this.httpClient.get<LiveEnvelope<LiveOfferStoreOptions>>(
        `${this.adminUrl}/offers/formoptions`,
      ),
      subscriptions: this.httpClient.get<LiveItems<LivePaymentSubscription>>(
        `${this.adminUrl}/subscriptions`,
      ),
      plans: this.httpClient.get<LiveEnvelope<readonly LivePlan[]>>(`${this.adminUrl}/plans`),
    }).pipe(
      map(({ storeOptions, subscriptions, plans }) =>
        toPaymentFormOptions(
          storeOptions.data.stores.map((store) => ({ id: String(store.id), name: store.name })),
          subscriptions.items,
          plans.data,
        ),
      ),
    );
  }

  // A payment points at a subscription, so the paid-for subscription is made first.
  createPayment(draft: NewPaymentDraft): Observable<Payment> {
    return this.httpClient
      .post<LiveEnvelope<LivePaymentSubscription>>(
        `${this.adminUrl}/subscriptions`,
        toLiveSubscriptionBody(draft),
      )
      .pipe(
        switchMap(({ data }) =>
          this.httpClient.post<LiveEnvelope<LivePayment>>(
            this.paymentsUrl,
            toLivePaymentBody(draft, data.id),
          ),
        ),
        map(({ data }) => toPayment(data)),
      );
  }

  updatePayment(id: string, changes: PaymentChanges): Observable<Payment> {
    return this.httpClient
      .put<LiveEnvelope<LivePayment>>(
        `${this.paymentsUrl}/${id}`,
        toLivePaymentChangesBody(changes),
      )
      .pipe(map(({ data }) => toPayment(data)));
  }

  deletePayment(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.paymentsUrl}/${id}`);
  }

  exportPayments(query: PaymentQuery): Observable<Blob> {
    return this.httpClient.get(`${this.paymentsUrl}/export`, {
      params: toPaymentFilterParams(query),
      responseType: 'blob',
    });
  }

  private readSummary(dateFrom?: string): Observable<LivePaymentSummary> {
    return this.httpClient
      .get<LiveEnvelope<LivePaymentSummary>>(`${this.paymentsUrl}/summary`, {
        params: dateFrom ? { date_from: dateFrom } : {},
      })
      .pipe(map(({ data }) => data));
  }

  // A deleted store or subscription must not hide the payment, so it only shortens the cards.
  private readOrNull<T>(url: string): Observable<T | null> {
    return this.httpClient.get<LiveEnvelope<T>>(url).pipe(
      map(({ data }) => data),
      catchError(() => of(null)),
    );
  }
}
