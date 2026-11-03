import { CurrencyCode } from './currency-code';
import { CURRENCY_CODES } from './currency-codes';
import { CURRENCY_SYMBOLS } from './currency-symbols';

const DEFAULT_CURRENCY: CurrencyCode = 'SYP';

function isSymbolOf(code: CurrencyCode, value: string): boolean {
  return CURRENCY_SYMBOLS[code] === value;
}

/** The server stores free text here (usd, $, ل.س), so anything unknown reads as the local currency. */
export function toCurrencyCode(value: string | null): CurrencyCode {
  const written = value?.trim() ?? '';
  return (
    CURRENCY_CODES.find((code) => code === written.toUpperCase() || isSymbolOf(code, written)) ??
    DEFAULT_CURRENCY
  );
}
