import { MerchantProduct } from './merchant-product';

/** Which dialog the page shows: the add/edit form (no product = add) or the delete question. */
export type ProductDialogRequest =
  | { readonly kind: 'form'; readonly product: MerchantProduct | null }
  | { readonly kind: 'delete'; readonly product: MerchantProduct };
