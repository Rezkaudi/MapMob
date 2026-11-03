import { arabicTextOf } from '../../../shared/data/arabic-text-of';
import { LIVE_ACTIVE } from '../../../shared/data/live-owner-status';
import { toCurrencyCode } from '../../../shared/money/to-currency-code';
import { MerchantProduct } from '../models/merchant-product';
import { LiveOwnerProduct } from './live-owner-product';

export function toMerchantProduct(product: LiveOwnerProduct): MerchantProduct {
  return {
    id: String(product.id),
    name: arabicTextOf(product.name) ?? '',
    price: product.price,
    currency: toCurrencyCode(product.currencyCode),
    imageUrl: product.imageUrl,
    isAvailable: product.status === LIVE_ACTIVE,
    // The server does not keep an order link for a product.
    orderUrl: null,
    updatedAt: product.updatedAt,
  };
}
