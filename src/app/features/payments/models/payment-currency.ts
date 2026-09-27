import { CurrencyCode } from '../../../shared/money/currency-code';
import { CURRENCY_FULL_NAMES, CURRENCY_NAMES } from '../../../shared/money/currency-names';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';

export type PaymentCurrency = CurrencyCode;

/** The short sign the amount field puts beside the number. */
export const PAYMENT_CURRENCY_SYMBOLS = CURRENCY_SYMBOLS;

export const PAYMENT_CURRENCY_LABELS = CURRENCY_NAMES;

/** The detail modal spells the currency out, "USD — دولار أمريكي". */
export const PAYMENT_CURRENCY_FULL_NAMES = CURRENCY_FULL_NAMES;
