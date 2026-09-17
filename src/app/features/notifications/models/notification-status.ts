export type NotificationStatus = 'sent' | 'scheduled' | 'draft';

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  sent: 'مُرسل',
  scheduled: 'مجدول',
  draft: 'مسودة',
};
