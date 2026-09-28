import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';

export function buildMerchantProduct(overrides: Partial<MerchantProduct> = {}): MerchantProduct {
  return {
    id: 'product-1',
    name: 'مرطب dove',
    price: 200,
    currency: 'SYP',
    imageUrl: null,
    isAvailable: true,
    orderUrl: null,
    updatedAt: '2026-09-21T12:00:00.000Z',
    ...overrides,
  };
}

export function buildMerchantProductCatalog(
  overrides: Partial<MerchantProductCatalog> = {},
): MerchantProductCatalog {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    productLimit: 5,
    items: [buildMerchantProduct()],
    ...overrides,
  };
}
