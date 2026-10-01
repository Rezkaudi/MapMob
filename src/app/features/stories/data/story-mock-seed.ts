import { NamedReference } from '../../../shared/models/named-reference';
import { StoryEntry } from '../models/story-entry';

const HOUR_MS = 3_600_000;
const STORY_LIFETIME_HOURS = 24;

/** A stored story: the status is worked out on every read, from the clock and this mark. */
export interface SeedStory extends Omit<StoryEntry, 'status'> {
  readonly isHidden: boolean;
}

const PLACES: readonly NamedReference[] = [
  { id: 'place-1', name: 'صيدلية الشفاء' },
  { id: 'place-4', name: 'كافيه ورد' },
  { id: 'place-3', name: 'صيدلية الحياة' },
  { id: 'place-5', name: 'مقهى الزاوية' },
  { id: 'place-7', name: 'ألبسة الجمال' },
  { id: 'place-9', name: 'مطعم الأصالة' },
];

/** [place index, text, picture, hours since publishing, views, hidden by an admin]. */
type StoryLine = readonly [number, string | null, string, number, number, boolean];

const STORY_LINES: readonly StoryLine[] = [
  [1, 'قهوة اليوم: لاتيه الفانيلا بنصف السعر', 'place-restaurant-hall.jpg', 1, 124, false],
  [0, 'خصم 20% على منتجات العناية بالبشرة حتى نهاية اليوم', 'offer-cosmetics.jpg', 3, 125, false],
  [4, 'وصلت تشكيلة الشتاء الجديدة', 'offer-winter-clothes.jpg', 4, 310, true],
  [5, 'طبق اليوم: مشاوي مشكلة مع المقبلات', 'ad-banner-grill.png', 6, 540, false],
  [2, 'استشارة صيدلانية مجانية طوال اليوم', 'media-pharmacy-aisle.jpg', 8, 96, false],
  [0, 'وصول دفعة سيرومات فيتامين C الجديدة', 'product-facial.jpg', 10, 842, false],
  [3, 'أمسية موسيقية مساء الخميس', 'place-cover.jpg', 12, 268, false],
  [1, null, 'place-storefront.jpg', 14, 73, true],
  [5, 'توصيل مجاني للطلبات فوق 100 ألف', 'place-aisle.jpg', 17, 415, false],
  [2, 'وصلت الفيتامينات والمكملات الغذائية', 'place-pills.jpg', 20, 512, false],
  [4, 'تنزيلات نهاية الموسم تبدأ غداً', 'offer-winter-clothes.jpg', 22, 198, false],
  [3, 'نفتح أبوابنا يوم الجمعة حتى منتصف الليل', 'place-cover.jpg', 23, 87, true],
  [0, 'عرض نهاية الأسبوع على المرطبات الطبية', 'place-shelf.jpg', 30, 680, false],
  [1, 'حلويات جديدة في قائمتنا', 'place-restaurant-hall.jpg', 41, 356, false],
  [5, 'عرض العائلة: وجبة لأربعة أشخاص', 'ad-banner-grill.png', 54, 921, false],
  [2, 'قياس الضغط والسكر مجاناً هذا الأسبوع', 'store-cover-pharmacy.jpg', 66, 244, true],
  [4, 'قطع محدودة من المعاطف الشتوية', 'offer-winter-clothes.jpg', 78, 133, false],
  [3, 'مشروب الموسم: شوكولا ساخنة بالبندق', 'place-cover.jpg', 102, 402, false],
  [0, 'منتجات الأطفال متوفرة من جديد', 'media-pharmacy-aisle.jpg', 126, 175, false],
  [1, 'جلسات خارجية جديدة في الحديقة', 'place-storefront.jpg', 150, 289, false],
  [5, 'افتتاح فرعنا الجديد في المزة', 'place-aisle.jpg', 174, 1240, false],
  [2, 'خصم 10% لكبار السن كل يوم أحد', 'place-pills.jpg', 198, 64, false],
];

function toSeedStory(line: StoryLine, index: number, now: Date): SeedStory {
  const [placeIndex, caption, picture, hoursSincePublished, viewCount, isHidden] = line;
  const publishedAt = now.getTime() - hoursSincePublished * HOUR_MS;
  return {
    id: `story-${index + 1}`,
    place: PLACES[placeIndex],
    kind: 'image',
    url: `assets/images/${picture}`,
    posterUrl: null,
    caption,
    publishedAt: new Date(publishedAt).toISOString(),
    expiresAt: new Date(publishedAt + STORY_LIFETIME_HOURS * HOUR_MS).toISOString(),
    viewCount,
    isHidden,
  };
}

/** Twelve stories still inside their 24 hours, three of them hidden, and ten that ran out. Times count back from `now`. */
export function buildStoryMockSeed(now: Date): readonly SeedStory[] {
  return STORY_LINES.map((line, index) => toSeedStory(line, index, now));
}
