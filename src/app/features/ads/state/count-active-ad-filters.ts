import { AdFilters } from '../models/ad-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveAdFilters(filters: AdFilters): number {
  const { from, to } = filters.runningRange;
  return [
    filters.status !== null,
    filters.contentType !== null,
    filters.advertiserType !== null,
    filters.placement !== null,
    from !== null || to !== null,
  ].filter(Boolean).length;
}
