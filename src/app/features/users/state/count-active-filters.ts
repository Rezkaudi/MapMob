import { UserFilters } from '../models/user-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveFilters(filters: UserFilters): number {
  return [
    filters.accountType !== null,
    filters.status !== null,
    filters.registrationPeriod !== 'all',
  ].filter(Boolean).length;
}
