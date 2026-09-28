import { CountTile } from '../../../shared/models/count-tile';
import { MerchantProduct } from '../models/merchant-product';

/** Total first, so RTL lays the tiles out right to left as the frame does. */
export function countProducts(products: readonly MerchantProduct[]): readonly CountTile[] {
  const available = products.filter((product) => product.isAvailable).length;
  return [
    { label: 'إجمالي المنتجات / الخدمات', count: products.length },
    { label: 'عناصر متاحة للزبائن (النشطة)', count: available },
    { label: 'عناصر غير متاحة حالياً', count: products.length - available },
  ];
}
