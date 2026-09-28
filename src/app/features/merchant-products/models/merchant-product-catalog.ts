import { MerchantProduct } from './merchant-product';

/** Everything the products page reads in one request: the plan's limit and every product. */
export interface MerchantProductCatalog {
  readonly plan: { readonly id: string; readonly name: string };
  /** How many products the current plan allows; null = no cap. */
  readonly productLimit: number | null;
  readonly items: readonly MerchantProduct[];
}
