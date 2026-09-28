import { NotificationCardView } from '../../../shared/models/notification-card-view';
import { NotificationEdgeTone } from '../../../shared/models/notification-edge-tone';
import { INBOX_CATEGORY_LABELS, InboxCategory } from '../models/inbox-category';
import { InboxNotification } from '../models/inbox-notification';

/** The admin frame colours البلاغات amber and الاشتراكات green; the other two take theme colours. */
const EDGE_TONES: Record<InboxCategory, NotificationEdgeTone> = {
  complaints: 'amber',
  subscriptions: 'green',
  offers: 'primary',
  system: 'muted',
};

export function toInboxCardView(notification: InboxNotification): NotificationCardView {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    categoryLabel: INBOX_CATEGORY_LABELS[notification.category],
    edgeTone: EDGE_TONES[notification.category],
    receivedAt: notification.receivedAt,
    isRead: notification.isRead,
    action: null,
  };
}
