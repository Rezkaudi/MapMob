import { CurrencyCode } from '../money/currency-code';

/** A product or service of a store that an offer can cover. */
export interface OfferItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: CurrencyCode;
}
