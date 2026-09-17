import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { AppNotification } from '../models/notification';
import { NOTIFICATION_KIND_LABELS } from '../models/notification-kind';
import { NotificationStatus } from '../models/notification-status';
import { RECIPIENT_MODE_LABELS, RECIPIENT_NOUNS } from '../models/recipient-mode';
import { formatSendDistance } from './format-send-distance';
import { formatSendTime } from './format-send-time';

export type NotificationPrimaryActionKind = 'reschedule' | 'resend' | 'edit';

export interface NotificationPrimaryAction {
  readonly kind: NotificationPrimaryActionKind;
  readonly label: string;
}

/** Everything the details dialog shows, worked out ahead so its template only prints it. */
export interface NotificationDetailView {
  readonly kindLabel: string;
  readonly recipientLabel: string;
  readonly recipientCountLabel: string;
  readonly sendTimeLabel: string;
  readonly sendDistanceLabel: string | null;
  readonly primaryAction: NotificationPrimaryAction;
}

const NO_SEND_TIME_LABEL = 'لم يحدد بعد';

/** A scheduled one can move, a sent one can go again, and a draft still needs its form. */
const PRIMARY_ACTIONS: Record<NotificationStatus, NotificationPrimaryAction> = {
  scheduled: { kind: 'reschedule', label: 'إعادة جدولة' },
  sent: { kind: 'resend', label: 'إعادة إرسال الإشعار' },
  draft: { kind: 'edit', label: 'تعديل الإشعار' },
};

export function buildNotificationDetailView(
  notification: AppNotification,
  now: Date,
): NotificationDetailView {
  const { sendAt, audience } = notification;
  return {
    kindLabel: `إشعار ${NOTIFICATION_KIND_LABELS[notification.kind]}`,
    recipientLabel: RECIPIENT_MODE_LABELS[audience][notification.recipientMode],
    recipientCountLabel: `${formatGroupedNumber(notification.recipientCount)} ${RECIPIENT_NOUNS[audience]}`,
    sendTimeLabel: sendAt ? formatSendTime(sendAt) : NO_SEND_TIME_LABEL,
    sendDistanceLabel: sendAt ? formatSendDistance(sendAt, now) : null,
    primaryAction: PRIMARY_ACTIONS[notification.status],
  };
}
