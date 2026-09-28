import { MerchantProduct } from '../models/merchant-product';
import { ProductCounts } from '../models/product-counts';

export function countProducts(products: readonly MerchantProduct[]): ProductCounts {
  const available = products.filter((product) => product.isAvailable).length;
  return { total: products.length, available, unavailable: products.length - available };
}
