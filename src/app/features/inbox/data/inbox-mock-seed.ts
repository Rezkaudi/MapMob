import { InboxNotification } from '../models/inbox-notification';

const MINUTE_MS = 60_000;
const TEN_MINUTES = 10;
const TWO_DAYS = 2 * 24 * 60;
const FOUR_DAYS = 4 * 24 * 60;

interface SeedEntry extends Omit<InboxNotification, 'receivedAt'> {
  readonly minutesAgo: number;
}

/** Every line here is copy from the Figma frames, including its two off-canvas items. */
const SEED_ENTRIES: readonly SeedEntry[] = [
  {
    id: 'inbox-complaint-1',
    category: 'complaints',
    title: 'بلاغ جديد',
    body: 'تم استلام بلاغ جديد على متجر صيدلية الشفاء ويحتاج إلى المراجعة.',
    isRead: false,
    minutesAgo: TEN_MINUTES,
  },
  {
    id: 'inbox-subscription-1',
    category: 'subscriptions',
    title: 'طلب ترقية باقة',
    body: 'طلب متجر الأمل الترقية إلى الباقة المميزة.',
    isRead: true,
    minutesAgo: TEN_MINUTES,
  },
  {
    id: 'inbox-offer-1',
    category: 'offers',
    title: 'لم تتم الموافقة على العرض الترويجي',
    body: 'لم تتم الموافقة على العرض لمخالفته شروط الوصف الواضح للمنتجات المشمولة. يرجى تعديل الشروط وإعادة الإرسال.',
    isRead: true,
    minutesAgo: TWO_DAYS,
  },
  {
    id: 'inbox-system-1',
    category: 'system',
    title: 'تحديث جديد على منصة MapMob للتجار',
    body: 'أطلقنا لوحة تحليلات تفاعلية أسرع مع إمكانية تصدير تقارير الزيارات بصيغة Excel وPDF لتسهيل تتبع أدائك.',
    isRead: true,
    minutesAgo: FOUR_DAYS,
  },
];

export function buildInboxSeed(now: Date): readonly InboxNotification[] {
  return SEED_ENTRIES.map(({ minutesAgo, ...entry }) => ({
    ...entry,
    receivedAt: new Date(now.getTime() - minutesAgo * MINUTE_MS).toISOString(),
  }));
}
