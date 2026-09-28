import { NotificationTab } from '../models/notification-tab';

/** Narrows a notification feed to the tab the reader picked. */
export function filterNotificationsByTab<TNotification extends { readonly isRead: boolean }>(
  notifications: readonly TNotification[],
  tab: NotificationTab,
): readonly TNotification[] {
  if (tab === 'all') {
    return notifications;
  }
  const wantsRead = tab === 'read';
  return notifications.filter((notification) => notification.isRead === wantsRead);
}
