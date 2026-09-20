import { InboxNotification } from '../models/inbox-notification';
import { InboxTab } from '../models/inbox-tab';

/** Narrows the feed to the tab the admin picked. */
export function filterInboxNotifications(
  notifications: readonly InboxNotification[],
  tab: InboxTab,
): readonly InboxNotification[] {
  if (tab === 'all') {
    return notifications;
  }
  const wantsRead = tab === 'read';
  return notifications.filter((notification) => notification.isRead === wantsRead);
}
