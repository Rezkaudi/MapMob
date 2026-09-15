import { ReviewFilters } from '../models/review-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveReviewFilters(filters: ReviewFilters): number {
  return [
    filters.rating !== null,
    filters.status !== null,
    filters.placeName.trim() !== '',
    filters.period !== 'all',
  ].filter(Boolean).length;
}
