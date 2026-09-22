import { PaymentMerchant } from './payment-merchant';
import { PaymentPlan } from './payment-plan';

/** Everything the "إضافة دفعة جديدة" dialog needs before it can be filled in. */
export interface PaymentFormOptions {
  readonly merchants: readonly PaymentMerchant[];
  readonly plans: readonly PaymentPlan[];
}
