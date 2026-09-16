import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Payment } from '../models/payment';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';

export abstract class PaymentRepository {
  abstract getPayments(query: PaymentQuery): Observable<PagedResult<Payment>>;
  abstract getSummary(): Observable<PaymentSummary>;
  abstract getPaymentDetail(id: string): Observable<PaymentDetail>;
  /** Every payment matching the filters, not just one page. */
  abstract exportPayments(query: PaymentQuery): Observable<Blob>;
}
