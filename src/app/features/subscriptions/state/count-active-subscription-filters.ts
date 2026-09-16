import { SubscriptionFilters } from '../models/subscription-filters';

/** The number beside "الفلاتر" counts the date range as one filter, not two. */
export function countActiveSubscriptionFilters(filters: SubscriptionFilters): number {
  const { tier, status, subscribedRange } = filters;
  const hasRange = Boolean(subscribedRange.from || subscribedRange.to);
  return [Boolean(tier), Boolean(status), hasRange].filter(Boolean).length;
}
