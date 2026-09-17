import { PaymentMethod } from './payment-method';

export type PaymentMethodDialogState =
  { readonly mode: 'add' } | { readonly mode: 'edit'; readonly method: PaymentMethod };
