import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Payment } from '../models/payment';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { toPaymentQueryParams } from './payment-query-params';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentHttpRepository implements PaymentRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get paymentsUrl(): string {
    return `${this.apiBaseUrl}/payments`;
  }

  getPayments(query: PaymentQuery): Observable<PagedResult<Payment>> {
    return this.httpClient.get<PagedResult<Payment>>(this.paymentsUrl, {
      params: toPaymentQueryParams(query),
    });
  }

  getSummary(): Observable<PaymentSummary> {
    return this.httpClient.get<PaymentSummary>(`${this.paymentsUrl}/summary`);
  }

  getPaymentDetail(id: string): Observable<PaymentDetail> {
    return this.httpClient.get<PaymentDetail>(`${this.paymentsUrl}/${id}`);
  }

  exportPayments(query: PaymentQuery): Observable<Blob> {
    return this.httpClient.get(`${this.paymentsUrl}/export`, {
      params: toPaymentQueryParams(query),
      responseType: 'blob',
    });
  }
}
