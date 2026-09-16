import { PaymentCurrency } from './payment-currency';
import { PaymentMethod } from './payment-method';

export interface Payment {
  readonly id: string;
  readonly transactionNumber: string;
  readonly receiptNumber: string;
  readonly companyName: string;
  readonly amount: number;
  readonly currency: PaymentCurrency;
  readonly paymentMethod: PaymentMethod;
  /** A calendar day written `yyyy-mm-dd`, like the rest of the codebase's domain dates. */
  readonly paidAt: string;
  readonly notes: string;
}
