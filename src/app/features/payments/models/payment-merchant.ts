import { PaymentCurrency } from './payment-currency';

/** A company or store the dialog can take a payment from, with the subscription it holds now. */
export interface PaymentMerchant {
  readonly id: string;
  readonly name: string;
  /** `null` when the merchant has never subscribed. */
  readonly currentPlanId: string | null;
  readonly currentPlanName: string | null;
  /** A calendar day written `yyyy-mm-dd`, or `null` with no running subscription. */
  readonly subscriptionEndsOn: string | null;
  readonly currency: PaymentCurrency;
}
