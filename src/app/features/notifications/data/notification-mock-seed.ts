import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationDetail } from '../models/notification-detail';
import { NotificationStatus } from '../models/notification-status';
import { RecipientMode } from '../models/recipient-mode';
import { resolveNotificationKind } from '../state/resolve-notification-kind';
import { toWallClockTime } from '../state/wall-clock-time';

const SEED = 20260908;
const HOUR_MS = 3_600_000;
const HOURS_PER_DAY = 24;
const LONGEST_DAY_GAP = 40;
const FEWEST_RECIPIENTS = 40;
const MOST_RECIPIENTS = 16_840;
const LOCATION_GOVERNORATE_ID = 'governorate-1';
const PICKED_RECIPIENT_IDS = ['recipient-1', 'recipient-2', 'recipient-3'];

/** The design's first four rows run sent, scheduled, draft, sent. */
const STATUS_CYCLE: readonly NotificationStatus[] = [
  'sent',
  'scheduled',
  'draft',
  'sent',
  'scheduled',
];
/** The design's rows all go to every user; later rows mix in the other choices. */
const LEADING_ALL_ROWS = 4;
const MODE_CYCLE: readonly RecipientMode[] = ['all', 'location', 'selected'];
const AUDIENCE_CYCLE: readonly NotificationAudience[] = ['users', 'users', 'companies'];

const TITLES = [
  'عروض جديدة بالقرب منك',
  'خصومات نهاية الأسبوع',
  'تحديث جديد للتطبيق',
  'متاجر جديدة انضمت إلينا',
  'ذكرنا برأيك في زيارتك الأخيرة',
  'جدد اشتراكك واحصل على شهر مجاني',
];

const BODIES = [
  'اكتشف أحدث العروض والخصومات المتوفرة بالقرب منك في الصيدليات والمتاجر الشريكة اليوم. لا تفوت الفرصة واستفد من العروض الحصرية قبل نفاد الكمية!',
  'استمتع بخصومات تصل إلى 30% في المطاعم والمقاهي المشاركة طوال عطلة نهاية الأسبوع.',
  'أضفنا ميزات جديدة تجعل البحث عن الأماكن القريبة أسرع وأسهل. حدّث التطبيق الآن.',
  'انضمت متاجر جديدة إلى المنصة في منطقتك. تصفحها واكتشف ما تقدمه من خدمات.',
];

function buildSendAt(status: NotificationStatus, now: Date, hoursAway: number): string | null {
  if (status === 'draft') {
    return null;
  }
  const direction = status === 'sent' ? -1 : 1;
  return toWallClockTime(new Date(now.getTime() + direction * hoursAway * HOUR_MS));
}

/** A fixed list, so the mock pages look the same on every reload. */
export function buildNotificationSeed(now: Date, count: number): readonly NotificationDetail[] {
  const next = createSeededRandom(SEED);
  return Array.from({ length: count }, (_, index) => {
    const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
    const recipientMode = index < LEADING_ALL_ROWS ? 'all' : MODE_CYCLE[index % MODE_CYCLE.length];
    const hoursAway = HOURS_PER_DAY * randomInt(next, 1, LONGEST_DAY_GAP) + randomInt(next, 1, 12);
    return {
      id: `notification-${index + 1}`,
      title: TITLES[index % TITLES.length],
      body: pickOne(next, BODIES),
      audience: index < LEADING_ALL_ROWS ? 'users' : AUDIENCE_CYCLE[index % AUDIENCE_CYCLE.length],
      recipientMode,
      kind: resolveNotificationKind(recipientMode),
      status,
      sendAt: buildSendAt(status, now, hoursAway),
      recipientCount: randomInt(next, FEWEST_RECIPIENTS, MOST_RECIPIENTS),
      imageUrl: null,
      governorateId: recipientMode === 'location' ? LOCATION_GOVERNORATE_ID : null,
      areaId: null,
      recipientIds: recipientMode === 'selected' ? PICKED_RECIPIENT_IDS : [],
    };
  });
}
