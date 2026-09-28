/** The three tabs above the feed. الكل is the one the design marks active. */
export type NotificationTab = 'all' | 'unread' | 'read';

export const NOTIFICATION_TABS: readonly NotificationTab[] = ['all', 'read', 'unread'];

export const NOTIFICATION_TAB_LABELS: Record<NotificationTab, string> = {
  all: 'الكل',
  read: 'مقروءة',
  unread: 'غير مقروءة',
};
