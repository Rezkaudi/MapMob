import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';

export interface PaymentMockData {
  readonly payments: readonly PaymentDetail[];
  readonly formOptions: PaymentFormOptions;
}

/** Loads the mock copy on the first request, so it stays out of the start-up bundle. */
@Injectable()
export class PaymentMockDataLoader {
  private data: Promise<PaymentMockData> | null = null;

  request<T>(work: (data: PaymentMockData) => T): Observable<T> {
    return defer(() => from(this.loadData())).pipe(
      switchMap((data) => mockRequest(() => work(data))),
    );
  }

  private loadData(): Promise<PaymentMockData> {
    this.data ??= Promise.all([
      import('../../../../mock/mock-payments'),
      import('../../../../mock/mock-payment-form-options'),
    ]).then(([{ MOCK_PAYMENTS }, { MOCK_PAYMENT_FORM_OPTIONS }]) => ({
      payments: MOCK_PAYMENTS,
      formOptions: MOCK_PAYMENT_FORM_OPTIONS,
    }));
    return this.data;
  }
}
