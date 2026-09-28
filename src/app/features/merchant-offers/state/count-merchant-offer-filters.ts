import { MerchantOfferFilters } from '../models/merchant-offer-filters';

/** Tells the "الفلاتر" button how many groups are narrowing the list. */
export function countMerchantOfferFilters(filters: MerchantOfferFilters): number {
  return [filters.status !== null, filters.scope !== null, filters.period !== 'all'].filter(Boolean)
    .length;
}
