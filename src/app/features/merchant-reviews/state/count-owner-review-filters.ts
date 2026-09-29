import { OwnerReviewFilters } from '../models/owner-review-filters';

/** How many filter groups are set to something other than "الكل". */
export function countOwnerReviewFilters(filters: OwnerReviewFilters): number {
  return [filters.rating !== null, filters.reportStatus !== null, filters.period !== 'all'].filter(
    Boolean,
  ).length;
}
