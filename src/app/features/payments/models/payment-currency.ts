export type PaymentCurrency = 'USD' | 'SYP';

export const PAYMENT_CURRENCY_LABELS: Record<PaymentCurrency, string> = {
  USD: 'دولار',
  SYP: 'ليرة سورية',
};

/** The detail modal spells the currency out, "USD — دولار أمريكي". */
export const PAYMENT_CURRENCY_FULL_NAMES: Record<PaymentCurrency, string> = {
  USD: 'USD — دولار أمريكي',
  SYP: 'SYP — ليرة سورية',
};
