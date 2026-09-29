import { PaymentMethod } from '../../../shared/models/payment-method';

/** The hero card spells the method out in full. */
export const PAYMENT_METHOD_IN_FULL: Record<PaymentMethod, string> = {
  cash: 'الدفع النقدي المباشر',
  other: 'طريقة دفع أخرى',
};

/** The dialogs use the short form. */
export const PAYMENT_METHOD_SHORT: Record<PaymentMethod, string> = {
  cash: 'دفع نقدي',
  other: 'طريقة أخرى',
};
