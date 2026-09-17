import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { AppNotification } from '../models/notification';
import { NotificationQuery } from '../models/notification-query';
import { toSendDay } from '../state/send-day';

/** Sorts below every real time, so a draft with no time sits last when newest leads. */
const NO_SEND_TIME = '';

export function queryNotifications<T extends AppNotification>(
  notifications: readonly T[],
  query: NotificationQuery,
): PagedResult<T> {
  const matching = notifications.filter((notification) => matchesQuery(notification, query));
  const sorted = sortListEntries(
    matching,
    query.sort,
    (notification) => notification.sendAt ?? NO_SEND_TIME,
    (notification) => notification.title,
  );
  return paginate(sorted, query.pageIndex, query.pageSize);
}

function matchesSearch(notification: AppNotification, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || [notification.title, notification.body].some((text) => text.includes(term));
}

function matchesSendDay(notification: AppNotification, query: NotificationQuery): boolean {
  if (!query.sentFrom && !query.sentTo) {
    return true;
  }
  const sendDay = toSendDay(notification.sendAt);
  if (!sendDay) {
    return false;
  }
  return (
    (!query.sentFrom || sendDay >= query.sentFrom) && (!query.sentTo || sendDay <= query.sentTo)
  );
}

function matchesQuery(notification: AppNotification, query: NotificationQuery): boolean {
  if (query.audience && notification.audience !== query.audience) {
    return false;
  }
  if (query.kind && notification.kind !== query.kind) {
    return false;
  }
  if (query.status && notification.status !== query.status) {
    return false;
  }
  return matchesSearch(notification, query.search) && matchesSendDay(notification, query);
}
