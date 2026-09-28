import { MerchantOffer } from './merchant-offer';

/** An offer as the table prints it. */
export interface MerchantOfferRow {
  readonly offer: MerchantOffer;
  /** Stands in for a missing picture on the orange tile. */
  readonly initial: string;
  readonly scopeText: string;
  readonly startsText: string;
  readonly endsText: string;
}
