export type PaymentMethod = 'cash' | 'other';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'نقداً',
  other: 'آخرى',
};
