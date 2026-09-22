import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Payment } from '../models/payment';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';

export abstract class PaymentRepository {
  abstract getPayments(query: PaymentQuery): Observable<PagedResult<Payment>>;
  abstract getSummary(): Observable<PaymentSummary>;
  abstract getPaymentDetail(id: string): Observable<PaymentDetail>;
  /** The merchants and plans the "إضافة دفعة جديدة" dialog offers. */
  abstract getPaymentFormOptions(): Observable<PaymentFormOptions>;
  abstract createPayment(draft: NewPaymentDraft): Observable<Payment>;
  /** Every payment matching the filters, not just one page. */
  abstract exportPayments(query: PaymentQuery): Observable<Blob>;
}
