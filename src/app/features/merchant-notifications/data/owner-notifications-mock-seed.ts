import { OwnerNotification } from '../models/owner-notification';

const MINUTE_MS = 60_000;
const SECOND_MS = 1_000;
const TEN_MINUTES_MS = 10 * MINUTE_MS;
const REVIEW_TITLE = 'لديك تقييم جديد من عميل';
const REVIEW_BODY = 'حصل متجرك على تقييم 5 من أحد المستخدمين';

/** Seconds apart, so all three frame cards read "منذ 10 دقائق" and keep the frame's order. */
const receivedTenMinutesAgo = (now: Date, order: number) =>
  new Date(now.getTime() - TEN_MINUTES_MS - order * SECOND_MS).toISOString();

/** Every line is copy from the frame, including its two off-canvas read items. */
export function buildOwnerNotificationsSeed(now: Date): readonly OwnerNotification[] {
  return [
    {
      id: 'owner-notification-subscription-1',
      category: 'subscriptions',
      title: 'تم تفعيل اشتراكك',
      body: 'تم تفعيل باقة "أساسية" بنجاح، ويستمر اشتراكك حتى 20 أكتوبر 2026. يمكنك استعراض تفاصيل المزايا الآن.',
      receivedAt: receivedTenMinutesAgo(now, 0),
      isRead: false,
      subjectId: null,
    },
    {
      id: 'owner-notification-review-1',
      category: 'reviews',
      title: REVIEW_TITLE,
      body: REVIEW_BODY,
      receivedAt: receivedTenMinutesAgo(now, 1),
      isRead: true,
      subjectId: 'review-1',
    },
    {
      id: 'owner-notification-review-2',
      category: 'reviews',
      title: REVIEW_TITLE,
      body: REVIEW_BODY,
      receivedAt: receivedTenMinutesAgo(now, 2),
      isRead: true,
      subjectId: 'review-2',
    },
    {
      id: 'owner-notification-offer-1',
      category: 'offers',
      title: 'لم تتم الموافقة على العرض الترويجي',
      body: 'لم تتم الموافقة على العرض لمخالفته شروط الوصف الواضح للمنتجات المشمولة. يرجى تعديل الشروط وإعادة الإرسال.',
      receivedAt: '2026-09-10T09:00:00.000Z',
      isRead: true,
      subjectId: 'offer-1',
    },
    {
      id: 'owner-notification-system-1',
      category: 'system',
      title: 'تحديث جديد على منصة MapMob للتجار',
      body: 'أطلقنا لوحة تحليلات تفاعلية أسرع مع إمكانية تصدير تقارير الزيارات بصيغة Excel وPDF لتسهيل تتبع أدائك.',
      receivedAt: '2026-09-08T09:00:00.000Z',
      isRead: true,
      subjectId: null,
    },
  ];
}
