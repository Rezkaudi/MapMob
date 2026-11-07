import { PaymentCurrency } from './payment-currency';

/** What the edit dialog may change on a recorded payment; the place and plan stay as they are. */
export interface PaymentChanges {
  readonly amount: number;
  readonly currency: PaymentCurrency;
  /** A calendar day written `yyyy-mm-dd`. */
  readonly paidAt: string;
  readonly notes: string;
}
