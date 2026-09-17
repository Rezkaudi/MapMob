import { AppNotification } from '../models/notification';
import { NOTIFICATION_AUDIENCE_LABELS } from '../models/notification-audience';
import { NOTIFICATION_KIND_LABELS } from '../models/notification-kind';
import { RECIPIENT_MODE_LABELS } from '../models/recipient-mode';
import { toSendDay } from './send-day';

/** One table row, with every label worked out so the template only shows it. */
export interface NotificationRow {
  readonly notification: AppNotification;
  readonly audienceLabel: string;
  readonly kindLabel: string;
  readonly recipientLabel: string;
  /** `yyyy-mm-dd`. */
  readonly sendDay: string | null;
}

export function buildNotificationRow(notification: AppNotification): NotificationRow {
  return {
    notification,
    audienceLabel: NOTIFICATION_AUDIENCE_LABELS[notification.audience],
    kindLabel: NOTIFICATION_KIND_LABELS[notification.kind],
    recipientLabel: RECIPIENT_MODE_LABELS[notification.audience][notification.recipientMode],
    sendDay: toSendDay(notification.sendAt),
  };
}
