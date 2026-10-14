import { CurrencyCode } from './currency-code';
import { CURRENCY_CODES } from './currency-codes';

const DEFAULT_CURRENCY: CurrencyCode = 'SYP';

/** The server stores free text here, so anything unknown reads as the local currency. */
export function toCurrencyCode(value: string | null): CurrencyCode {
  return CURRENCY_CODES.find((code) => code === value) ?? DEFAULT_CURRENCY;
}
