import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { summarizePayments } from '../../../../mock/summarize-payments';
import { CLOCK } from '../../../core/config/clock';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { Payment } from '../models/payment';
import { PaymentChanges } from '../models/payment-changes';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { PaymentMockData, PaymentMockDataLoader } from './payment-mock-data-loader';
import { filterPayments, queryPayments } from './payment-list-query';
import { buildPaymentsCsvFile } from './payments-csv';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentMockRepository implements PaymentRepository {
  private readonly clock = inject(CLOCK);
  private readonly loader = inject(PaymentMockDataLoader);

  getPayments(query: PaymentQuery): Observable<PagedResult<Payment>> {
    return this.loader.request(({ payments }) => queryPayments(payments, query));
  }

  getSummary(): Observable<PaymentSummary> {
    return this.loader.request(({ payments }) =>
      summarizePayments(payments, toCalendarDay(this.clock())),
    );
  }

  getPaymentDetail(id: string): Observable<PaymentDetail> {
    return this.loader.request(({ payments }) => findPayment(payments, id));
  }

  getPaymentFormOptions(): Observable<PaymentFormOptions> {
    return this.loader.request(({ formOptions }) => formOptions);
  }

  createPayment(draft: NewPaymentDraft): Observable<Payment> {
    return this.loader.request((data) => recordPayment(data, draft));
  }

  updatePayment(id: string, changes: PaymentChanges): Observable<Payment> {
    return this.loader.request((data) => changePayment(data, id, changes));
  }

  deletePayment(id: string): Observable<void> {
    return this.loader.request((data) => removePayment(data, id));
  }

  exportPayments(query: PaymentQuery): Observable<Blob> {
    return this.loader.request(({ payments }) =>
      buildPaymentsCsvFile(filterPayments(payments, query)),
    );
  }
}

function recordPayment(
  {
    payments,
    formOptions,
  }: { payments: readonly PaymentDetail[]; formOptions: PaymentFormOptions },
  draft: NewPaymentDraft,
): Payment {
  const merchant = formOptions.merchants.find((candidate) => candidate.id === draft.merchantId);
  if (!merchant) {
    throw new Error(`لم يتم العثور على التاجر ${draft.merchantId}`);
  }
  const serial = payments.length + 1;
  return {
    id: `payment-${serial}`,
    transactionNumber: `#PAY-${serial}`,
    receiptNumber: `INV-${serial}`,
    companyName: merchant.name,
    amount: draft.amount,
    currency: draft.currency,
    paymentMethod: draft.paymentMethod,
    paidAt: draft.paidAt,
    notes: draft.notes,
  };
}

function findPayment(payments: readonly PaymentDetail[], id: string): PaymentDetail {
  const payment = payments.find((candidate) => candidate.id === id);
  if (!payment) {
    throw new Error(`لم يتم العثور على الدفعة ${id}`);
  }
  return payment;
}

function changePayment(data: PaymentMockData, id: string, changes: PaymentChanges): Payment {
  const changed = { ...findPayment(data.payments, id), ...changes };
  data.payments = data.payments.map((payment) => (payment.id === id ? changed : payment));
  return changed;
}

function removePayment(data: PaymentMockData, id: string): void {
  findPayment(data.payments, id);
  data.payments = data.payments.filter((payment) => payment.id !== id);
}
