import { buildMerchantProduct } from '../testing/merchant-product-fixture';
import { countProducts } from './product-counts';

describe('countProducts', () => {
  it('counts every product, then splits them by availability, total first', () => {
    const products = [
      buildMerchantProduct({ id: '1' }),
      buildMerchantProduct({ id: '2', isAvailable: false }),
      buildMerchantProduct({ id: '3' }),
    ];

    expect(countProducts(products)).toEqual([
      { label: 'إجمالي المنتجات / الخدمات', count: 3 },
      { label: 'عناصر متاحة للزبائن (النشطة)', count: 2 },
      { label: 'عناصر غير متاحة حالياً', count: 1 },
    ]);
  });

  it('gives zeros for an empty list', () => {
    expect(countProducts([]).map((tile) => tile.count)).toEqual([0, 0, 0]);
  });
});
