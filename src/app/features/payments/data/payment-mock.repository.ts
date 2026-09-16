import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { MOCK_PAYMENTS } from '../../../../mock/mock-payments';
import { summarizePayments } from '../../../../mock/summarize-payments';
import { CLOCK } from '../../../core/config/clock';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { PagedResult } from '../../../core/models/paged-result';
import { Payment } from '../models/payment';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { filterPayments, queryPayments } from './payment-mock-query';
import { buildPaymentsCsvFile } from './payments-csv';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentMockRepository implements PaymentRepository {
  private readonly clock = inject(CLOCK);

  getPayments(query: PaymentQuery): Observable<PagedResult<Payment>> {
    return mockRequest(() => queryPayments(MOCK_PAYMENTS, query));
  }

  getSummary(): Observable<PaymentSummary> {
    return mockRequest(() => summarizePayments(MOCK_PAYMENTS, toCalendarDay(this.clock())));
  }

  getPaymentDetail(id: string): Observable<PaymentDetail> {
    return mockRequest(() => findPayment(id));
  }

  exportPayments(query: PaymentQuery): Observable<Blob> {
    return mockRequest(() => buildPaymentsCsvFile(filterPayments(MOCK_PAYMENTS, query)));
  }
}

function findPayment(id: string): PaymentDetail {
  const payment = MOCK_PAYMENTS.find((candidate) => candidate.id === id);
  if (!payment) {
    throw new Error(`لم يتم العثور على الدفعة ${id}`);
  }
  return payment;
}
