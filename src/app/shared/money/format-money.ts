import { CurrencyCode } from './currency-code';
import { CURRENCY_SYMBOLS } from './currency-symbols';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return `${NUMBER_FORMAT.format(amount)} ${CURRENCY_SYMBOLS[currency]}`;
}
