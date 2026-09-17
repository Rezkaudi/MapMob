import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDraft } from '../models/payment-method-draft';
import { PaymentMethodsRepository } from './payment-methods.repository';

@Injectable()
export class PaymentMethodsHttpRepository implements PaymentMethodsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get methodsUrl(): string {
    return `${this.apiBaseUrl}/settings/payment-methods`;
  }

  getMethods(): Observable<readonly PaymentMethod[]> {
    return this.httpClient.get<readonly PaymentMethod[]>(this.methodsUrl);
  }

  addMethod(draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.httpClient.post<PaymentMethod>(this.methodsUrl, draft);
  }

  updateMethod(id: string, draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.httpClient.put<PaymentMethod>(`${this.methodsUrl}/${id}`, draft);
  }
}
