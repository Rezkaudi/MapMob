import { CurrencyCode } from './currency-code';

/** An amount with its currency, sent as `{ amount, currency }`. */
export interface Money {
  readonly amount: number;
  readonly currency: CurrencyCode;
}
