import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { LivePlan } from '../../../shared/data/live-plan';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { Payment } from '../models/payment';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { LivePayment } from './live-payment';
import {
  toLivePaymentBody,
  toLiveSubscriptionBody,
  toPayment,
  toPaymentDetail,
  toPaymentFormOptions,
} from './live-payment-mapping';
import { LivePaymentStore } from './live-payment-store';
import { LivePaymentSubscription } from './live-payment-subscription';
import { filterPayments, queryPayments } from './payment-list-query';
import { PaymentRepository } from './payment.repository';
import { buildPaymentsCsvFile } from './payments-csv';
import { summarizeLivePayments } from './summarize-live-payments';

// One big page brings every row, so the panel's own filters, cards and export can use them all.
const ALL_ROWS_PAGE_SIZE = 1000;

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
    return this.loadAll().pipe(map((rows) => queryPayments(rows.map(toPayment), query)));
  }

  getSummary(): Observable<PaymentSummary> {
    const today = toCalendarDay(this.clock());
    return this.loadAll().pipe(map((rows) => summarizeLivePayments(rows, today)));
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
      stores: this.httpClient.get<LiveItems<{ id: string; name: string }>>(
        `${this.adminUrl}/stores`,
        { params: { per_page: ALL_ROWS_PAGE_SIZE } },
      ),
      subscriptions: this.httpClient.get<LiveItems<LivePaymentSubscription>>(
        `${this.adminUrl}/subscriptions`,
      ),
      plans: this.httpClient.get<LiveEnvelope<readonly LivePlan[]>>(`${this.adminUrl}/plans`),
    }).pipe(
      map(({ stores, subscriptions, plans }) =>
        toPaymentFormOptions(stores.items, subscriptions.items, plans.data),
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

  exportPayments(query: PaymentQuery): Observable<Blob> {
    return this.loadAll().pipe(
      map((rows) => buildPaymentsCsvFile(filterPayments(rows.map(toPayment), query))),
    );
  }

  private loadAll(): Observable<readonly LivePayment[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LivePayment[]>>(this.paymentsUrl, {
        params: { per_page: ALL_ROWS_PAGE_SIZE },
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
