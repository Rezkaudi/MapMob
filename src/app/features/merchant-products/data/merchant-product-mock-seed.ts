import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const SEED_PRODUCTS: readonly Omit<MerchantProduct, 'updatedAt'>[] = [
  {
    id: 'product-1',
    name: 'مرطب dove',
    price: 200,
    currency: 'SYP',
    imageUrl: null,
    isAvailable: true,
    orderUrl: null,
  },
  {
    id: 'product-2',
    name: 'سيروم فيتامين C',
    price: 350,
    currency: 'SYP',
    imageUrl: null,
    isAvailable: true,
    orderUrl: 'https://shop.example.com/serum',
  },
  {
    id: 'product-3',
    name: 'تنظيف بشرة عميق',
    price: 500,
    currency: 'SYP',
    imageUrl: null,
    isAvailable: true,
    orderUrl: null,
  },
];

/** The frame's free plan at 3 of 5 products, each changed a week before `now`. */
export function buildMerchantProductSeed(now: Date): MerchantProductCatalog {
  const updatedAt = new Date(now.getTime() - WEEK_MS).toISOString();
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    productLimit: 5,
    items: SEED_PRODUCTS.map((product) => ({ ...product, updatedAt })),
  };
}
