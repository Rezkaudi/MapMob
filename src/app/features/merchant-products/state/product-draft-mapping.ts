import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';

export function toProductDraft(product: MerchantProduct): ProductDraft {
  return {
    name: product.name,
    price: product.price,
    currency: product.currency,
    isAvailable: product.isAvailable,
    imageUrl: product.imageUrl ?? '',
    imageFile: null,
    orderUrl: product.orderUrl ?? '',
  };
}
