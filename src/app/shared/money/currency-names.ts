import { CurrencyCode } from './currency-code';

/** The short Arabic name, used by filter chips and the detail rows. */
export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  SYP: 'ليرة سورية',
  USD: 'دولار',
};

/** The spelled-out name, used where the currency needs no other context. */
export const CURRENCY_FULL_NAMES: Record<CurrencyCode, string> = {
  SYP: 'SYP — ليرة سورية',
  USD: 'USD — دولار أمريكي',
};
