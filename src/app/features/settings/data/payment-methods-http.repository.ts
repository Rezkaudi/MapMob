import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDraft } from '../models/payment-method-draft';
import { PaymentMethodsRepository } from './payment-methods.repository';

@Injectable()
export class PaymentMethodsHttpRepository implements PaymentMethodsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly methodsUrl = `${inject(API_BASE_URL)}/admin/settings/paymentmethods`;

  getMethods(): Observable<readonly PaymentMethod[]> {
    return this.httpClient.get<readonly PaymentMethod[]>(this.methodsUrl);
  }

  addMethod(draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.httpClient
      .post<LiveEnvelope<PaymentMethod>>(this.methodsUrl, draft)
      .pipe(map(({ data }) => data));
  }

  updateMethod(id: string, draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.httpClient
      .put<LiveEnvelope<PaymentMethod>>(`${this.methodsUrl}/${id}`, draft)
      .pipe(map(({ data }) => data));
  }
}
