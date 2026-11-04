export type NotificationStatus = 'sent' | 'scheduled';

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  sent: 'مُرسل',
  scheduled: 'مجدول',
};
