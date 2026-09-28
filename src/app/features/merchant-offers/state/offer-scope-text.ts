import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { MerchantOffer } from '../models/merchant-offer';

const ALL_ITEMS_TEXT = 'جميع المنتجات';
const PRODUCT_WORDS: CountWords = {
  one: 'منتج واحد',
  two: 'منتجين',
  few: 'منتجات',
  many: 'منتجاً',
};

/** The table's "النطاق" cell: "3 منتجات" or "جميع المنتجات". */
export function describeOfferScopeInTable(offer: MerchantOffer): string {
  return offer.scope === 'allItems'
    ? ALL_ITEMS_TEXT
    : formatArabicCount(offer.itemIds.length, PRODUCT_WORDS);
}

/** The drawer's line after "النطاق:". */
export function describeOfferScope(offer: MerchantOffer): string {
  return offer.scope === 'allItems'
    ? `يشمل ${ALL_ITEMS_TEXT}`
    : `يشمل ${formatArabicCount(offer.itemIds.length, PRODUCT_WORDS)} محددة`;
}
