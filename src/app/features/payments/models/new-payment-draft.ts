import { PaymentCurrency } from './payment-currency';
import { PaymentKind } from './payment-kind';
import { PaymentTerm } from './payment-term';

/** What the dialog sends when the admin records a cash payment. */
export interface NewPaymentDraft {
  readonly merchantId: string;
  readonly kind: PaymentKind;
  readonly planId: string;
  readonly term: PaymentTerm;
  readonly amount: number;
  readonly currency: PaymentCurrency;
  /** A calendar day written `yyyy-mm-dd`. */
  readonly paidAt: string;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly notes: string;
}
