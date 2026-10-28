import { SubscriptionQuery } from '../models/subscription-query';

// The server export filters by status only, and has no single status for "paused".
const SERVER_EXPORT_STATUSES = ['active', 'expired'];

export function canServerExport(query: SubscriptionQuery): boolean {
  const hasOtherFilter = Boolean(
    query.search?.trim() || query.tier || query.subscribedFrom || query.subscribedTo,
  );
  return !hasOtherFilter && (!query.status || SERVER_EXPORT_STATUSES.includes(query.status));
}

export function toServerExportParams(query: SubscriptionQuery): Record<string, string> {
  return query.status ? { status: query.status } : {};
}
