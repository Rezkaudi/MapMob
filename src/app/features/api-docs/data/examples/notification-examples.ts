import type { InboxNotification } from '../../../inbox/models/inbox-notification';
import type { AudienceEstimate } from '../../../notifications/models/audience-estimate';
import type { NotificationFormOptions } from '../../../notifications/models/notification-form-options';
import type { NotificationRecipient } from '../../../notifications/models/notification-recipient';
import type { NotificationSummary } from '../../../notifications/models/notification-summary';

export const NOTIFICATION_ROW = {
  id: 'n1',
  title: 'تحديث جديد',
  body: 'نسخة جديدة من التطبيق متوفرة الآن',
  audience: 'users',
  recipientMode: 'location',
  kind: 'private',
  status: 'scheduled',
  sendAt: '2026-10-01T20:00:00+03:00',
  recipientCount: 4820,
};

export const NOTIFICATION_SUMMARY = {
  totalCount: 74,
  sentCount: 58,
  scheduledCount: 6,
  draftCount: 10,
} satisfies NotificationSummary;

export const NOTIFICATION_DETAIL = {
  ...NOTIFICATION_ROW,
  imageUrl: 'https://api.mapmob.com.co/storage/notifications/n1.png',
  governorateId: '1',
  areaId: '2',
  recipientIds: [],
  sentAt: null,
};

export const NOTIFICATION_FORM = {
  title: 'تحديث جديد',
  body: 'نسخة جديدة من التطبيق متوفرة الآن',
  audience: 'users',
  recipientMode: 'location',
  intent: 'publish',
  isImageRemoved: false,
  governorateId: '1',
  areaId: '2',
  sendAt: '2026-10-01T20:00:00+03:00',
  image: '@banner.png',
};

export const NOTIFICATION_FORM_OPTIONS = {
  governorates: [
    {
      id: '1',
      name: 'دمشق',
      areas: [
        { id: '2', name: 'المزة' },
        { id: '3', name: 'كفرسوسة' },
      ],
    },
  ],
} satisfies NotificationFormOptions;

export const NOTIFICATION_RECIPIENTS = [
  { id: '5', name: 'أحمد خليل', phone: '963936318327', city: 'دمشق' },
] satisfies NotificationRecipient[];

export const AUDIENCE_ESTIMATE = {
  deviceCount: 16840,
  sharePercent: 68.5,
} satisfies AudienceEstimate;

export const INBOX_ITEMS = [
  {
    id: 'i1',
    category: 'complaints',
    title: 'بلاغ جديد',
    body: 'ورد بلاغ على متجر دمشق المركزي',
    receivedAt: '2026-09-27T08:12:00Z',
    isRead: false,
  },
  {
    id: 'i2',
    category: 'subscriptions',
    title: 'اشتراك ينتهي قريباً',
    body: 'ينتهي اشتراك صيدلية الشفاء خلال 3 أيام',
    receivedAt: '2026-09-26T15:40:00Z',
    isRead: true,
  },
] satisfies InboxNotification[];
