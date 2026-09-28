import { MerchantOffer } from './merchant-offer';

/** Everything the offers page reads in one request: the plan's limit and every offer. */
export interface MerchantOfferCatalog {
  readonly plan: { readonly id: string; readonly name: string };
  /** How many live offers the current plan allows at once; null = no cap. */
  readonly activeOfferLimit: number | null;
  readonly items: readonly MerchantOffer[];
}
