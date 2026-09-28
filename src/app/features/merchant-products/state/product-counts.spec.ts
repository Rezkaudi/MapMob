import { buildMerchantProduct } from '../testing/merchant-product-fixture';
import { countProducts } from './product-counts';

describe('countProducts', () => {
  it('counts every product, then splits them by availability', () => {
    const products = [
      buildMerchantProduct({ id: '1' }),
      buildMerchantProduct({ id: '2', isAvailable: false }),
      buildMerchantProduct({ id: '3' }),
    ];

    expect(countProducts(products)).toEqual({ total: 3, available: 2, unavailable: 1 });
  });

  it('gives zeros for an empty list', () => {
    expect(countProducts([])).toEqual({ total: 0, available: 0, unavailable: 0 });
  });
});
