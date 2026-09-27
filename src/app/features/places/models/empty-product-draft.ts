import { ProductDraft } from './product-draft';

/** What the product dialog starts with when a product is being added. */
export const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  name: '',
  price: 0,
  currency: 'SYP',
  isAvailable: true,
  imageUrl: '',
  orderUrl: '',
};
