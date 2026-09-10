export type NotificationPriority = 'general' | 'important' | 'urgent';

export const NOTIFICATION_PRIORITY_LABEL: Record<NotificationPriority, string> = {
  general: 'عام (تحديثات)',
  important: 'مهم (تنبيه)',
  urgent: 'عاجل (طارئ)',
};

/** The dot colour each priority carries in the design. */
export const NOTIFICATION_PRIORITY_DOT: Record<NotificationPriority, string> = {
  general: 'bg-primary',
  important: 'bg-status-warning',
  urgent: 'bg-status-error',
};
