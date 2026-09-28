import { OwnerNotification } from '../models/owner-notification';

export function buildOwnerNotification(
  overrides: Partial<OwnerNotification> = {},
): OwnerNotification {
  return {
    id: 'owner-notification-1',
    category: 'subscriptions',
    title: 'تم تفعيل اشتراكك',
    body: 'تم تفعيل باقة "أساسية" بنجاح، ويستمر اشتراكك حتى 20 أكتوبر 2026. يمكنك استعراض تفاصيل المزايا الآن.',
    receivedAt: '2026-09-29T09:50:00.000Z',
    isRead: false,
    subjectId: null,
    ...overrides,
  };
}
