import { formatArabicRelativeTime } from '../../../shared/formatting/arabic-relative-time';
import { PRODUCT_AVAILABILITY_LABELS } from '../../../shared/models/product-availability';
import { formatMoney } from '../../../shared/money/format-money';
import { MerchantProduct } from '../models/merchant-product';
import { ProductTableRow } from '../models/product-table-row';

export function toProductTableRow(product: MerchantProduct, now: Date): ProductTableRow {
  return {
    product,
    initial: product.name.trim().charAt(0),
    priceText: formatMoney(product.price, product.currency),
    updatedText: formatArabicRelativeTime(product.updatedAt, now, { isWeekCounted: true }),
    status: product.isAvailable ? 'active' : 'suspended',
    statusLabel: product.isAvailable
      ? PRODUCT_AVAILABILITY_LABELS.available
      : PRODUCT_AVAILABILITY_LABELS.unavailable,
  };
}
