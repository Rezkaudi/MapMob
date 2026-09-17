import { NotificationDraft } from '../models/notification-draft';
import { AppNotification } from '../models/notification';
import { NotificationDetail } from '../models/notification-detail';

export function buildNotification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    id: 'notification-1',
    title: 'عروض جديدة بالقرب منك',
    body: 'اكتشف أحدث العروض والخصومات المتوفرة بالقرب منك.',
    audience: 'users',
    recipientMode: 'all',
    kind: 'general',
    status: 'scheduled',
    sendAt: '2026-09-10T10:00',
    recipientCount: 1250,
    ...overrides,
  };
}

export function buildNotificationDetail(
  overrides: Partial<NotificationDetail> = {},
): NotificationDetail {
  return {
    ...buildNotification(),
    imageUrl: null,
    governorateId: null,
    areaId: null,
    recipientIds: [],
    ...overrides,
  };
}

export function buildNotificationDraft(
  overrides: Partial<NotificationDraft> = {},
): NotificationDraft {
  return {
    title: 'عروض جديدة بانتظارك',
    body: 'اكتشف أحدث العروض والأماكن القريبة منك الآن.',
    audience: 'users',
    recipientMode: 'all',
    governorateId: null,
    areaId: null,
    recipientIds: [],
    sendAt: null,
    intent: 'publish',
    image: null,
    isImageRemoved: false,
    ...overrides,
  };
}
