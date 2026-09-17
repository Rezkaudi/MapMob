import { PaymentMethod } from './payment-method';

export type PaymentMethodDraft = Omit<PaymentMethod, 'id'>;
