import { OfferFilters } from '../models/offer-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveOfferFilters(filters: OfferFilters): number {
  const { from, to } = filters.runningRange;
  return [filters.status !== null, from !== null || to !== null].filter(Boolean).length;
}
