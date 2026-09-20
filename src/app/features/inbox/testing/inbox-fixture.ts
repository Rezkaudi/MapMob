import { InboxNotification } from '../models/inbox-notification';

export function buildInboxNotification(
  overrides: Partial<InboxNotification> = {},
): InboxNotification {
  return {
    id: 'inbox-1',
    category: 'complaints',
    title: 'بلاغ جديد',
    body: 'تم استلام بلاغ جديد على متجر صيدلية الشفاء ويحتاج إلى المراجعة.',
    receivedAt: '2026-09-20T09:50:00.000Z',
    isRead: false,
    ...overrides,
  };
}
