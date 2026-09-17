import { ComplaintFilters } from '../models/complaint-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveComplaintFilters(filters: ComplaintFilters): number {
  return [filters.status !== null, filters.reportPeriod !== 'all'].filter(Boolean).length;
}
