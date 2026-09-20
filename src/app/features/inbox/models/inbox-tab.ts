/** The three tabs above the feed. الكل is the one the design marks active. */
export type InboxTab = 'all' | 'unread' | 'read';

export const INBOX_TABS: readonly InboxTab[] = ['all', 'read', 'unread'];

export const INBOX_TAB_LABELS: Record<InboxTab, string> = {
  all: 'الكل',
  read: 'مقروءة',
  unread: 'غير مقروءة',
};
