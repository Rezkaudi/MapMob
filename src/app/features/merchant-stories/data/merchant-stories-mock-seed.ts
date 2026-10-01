import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';

const HOUR_MS = 3_600_000;
export const STORY_LIFETIME_HOURS = 24;

interface SeedStory {
  readonly caption: string;
  readonly picture: string;
  readonly hoursSincePublished: number;
  readonly viewCount: number;
}

/** The frame's page at its own hour: the first story went out 10 hours ago, so 14 are left. */
const SEED_STORIES: readonly SeedStory[] = [
  {
    caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
    picture: 'assets/images/product-facial.jpg',
    hoursSincePublished: 10,
    viewCount: 348,
  },
  {
    caption: 'خصم 20% على منتجات العناية بالبشرة حتى نهاية اليوم',
    picture: 'assets/images/offer-cosmetics.jpg',
    hoursSincePublished: 3,
    viewCount: 125,
  },
  {
    caption: 'استشارة صيدلانية مجانية طوال اليوم',
    picture: 'assets/images/media-pharmacy-aisle.jpg',
    hoursSincePublished: 20,
    viewCount: 842,
  },
  {
    caption: 'عرض نهاية الأسبوع على المرطبات الطبية',
    picture: 'assets/images/place-shelf.jpg',
    hoursSincePublished: 54,
    viewCount: 680,
  },
  {
    caption: 'وصلت الفيتامينات والمكملات الغذائية',
    picture: 'assets/images/place-pills.jpg',
    hoursSincePublished: 102,
    viewCount: 512,
  },
  {
    caption: 'نفتح أبوابنا يوم الجمعة حتى منتصف الليل',
    picture: 'assets/images/store-cover-pharmacy.jpg',
    hoursSincePublished: 174,
    viewCount: 431,
  },
];

function toStory(seed: SeedStory, index: number, now: Date): MerchantStory {
  const publishedAt = now.getTime() - seed.hoursSincePublished * HOUR_MS;
  return {
    id: `story-${index + 1}`,
    kind: 'image',
    url: seed.picture,
    posterUrl: null,
    caption: seed.caption,
    status: seed.hoursSincePublished < STORY_LIFETIME_HOURS ? 'active' : 'expired',
    publishedAt: new Date(publishedAt).toISOString(),
    expiresAt: new Date(publishedAt + STORY_LIFETIME_HOURS * HOUR_MS).toISOString(),
    viewCount: seed.viewCount,
  };
}

/** The frame's free plan: 3 active stories of 5. Times count back from `now`. */
export function buildMerchantStoriesSeed(now: Date): MerchantStoryLibrary {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    place: { id: 'place-1', name: 'صيدلية الشفاء' },
    activeStoryLimit: 5,
    items: SEED_STORIES.map((seed, index) => toStory(seed, index, now)),
  };
}
