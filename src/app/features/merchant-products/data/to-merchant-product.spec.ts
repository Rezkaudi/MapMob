import { toMerchantProduct } from './to-merchant-product';
import { LiveOwnerProduct } from './live-owner-product';

const LIVE_PRODUCT = {
  id: '9',
  name: { ar: 'قميص', en: 'Shirt' },
  price: 100,
  currencyCode: 'SYP',
  imageUrl: null,
  status: 'active',
  updatedAt: '2026-11-03T10:00:00Z',
} as unknown as LiveOwnerProduct;

describe('toMerchantProduct', () => {
  it('reads a currency the server wrote in small letters or as its sign', () => {
    const currencies = ['syp', 'ل.س', 'usd'].map(
      (currencyCode) => toMerchantProduct({ ...LIVE_PRODUCT, currencyCode }).currency,
    );

    expect(currencies).toEqual(['SYP', 'SYP', 'USD']);
  });
});
