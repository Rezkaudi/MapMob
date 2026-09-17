import { NotificationFilters } from '../models/notification-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActiveNotificationFilters(filters: NotificationFilters): number {
  return [
    filters.audience !== null,
    filters.kind !== null,
    filters.status !== null,
    filters.sendPeriod !== 'all',
  ].filter(Boolean).length;
}
