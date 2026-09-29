import { CurrencyCode } from '../../../shared/money/currency-code';
import { BillingCycle } from '../../../shared/models/billing-cycle';
import { PaymentMethod } from '../../../shared/models/payment-method';
import { SubscriptionStatus } from '../../../shared/models/subscription-status';

/** One period of the place on one plan: the hero card and each "سجل الاشتراكات" row. */
export interface SubscriptionRecord {
  readonly id: string;
  readonly plan: { readonly id: string; readonly name: string };
  readonly term: BillingCycle;
  readonly price: { readonly amount: number; readonly currency: CurrencyCode };
  readonly paymentMethod: PaymentMethod;
  /** yyyy-mm-dd */
  readonly startsOn: string;
  /** yyyy-mm-dd */
  readonly endsOn: string;
  readonly status: SubscriptionStatus;
}
