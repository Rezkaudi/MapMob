import { NotificationKind } from '../models/notification-kind';
import { RecipientMode } from '../models/recipient-mode';

export function resolveNotificationKind(recipientMode: RecipientMode): NotificationKind {
  return recipientMode === 'all' ? 'general' : 'private';
}
