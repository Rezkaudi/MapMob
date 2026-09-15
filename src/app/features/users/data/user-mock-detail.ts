import { createSeededRandom, randomInt } from '../../../../mock/random';
import { FavoritePlace } from '../models/favorite-place';
import { AppUser } from '../models/user';
import { UserActivity } from '../models/user-activity';
import { UserDetail } from '../models/user-detail';
import { UserReview } from '../models/user-review';

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const MAX_STARS = 5;
const EXTRA_SEARCHES = { min: 20, max: 160 };
const EXTRA_VIEWS = { min: 5, max: 40 };

const ACTIVITY_SEEDS: readonly Omit<UserActivity, 'id' | 'occurredAt'>[] = [
  { type: 'search', description: 'بحث عن مطاعم وكافيهات في حي الروضة' },
  { type: 'favorite', description: 'إضافة "صيدلية الشفاء" إلى المفضلة' },
  { type: 'review', description: 'إضافة تقييم 5 نجوم لـ "مقهى ديم"' },
  { type: 'share', description: 'مشاركة رابط مكان عبر تطبيق الهاتف' },
];
/** How long before the user's last activity each seeded activity happened. */
const ACTIVITY_OFFSETS_MS = [0, 50 * MINUTE_MS, DAY_MS, 3 * DAY_MS];

const FAVORITE_SEEDS: readonly Omit<FavoritePlace, 'id' | 'savedAt'>[] = [
  {
    placeName: 'مطعم النخيل',
    placeKind: 'restaurant',
    categoryName: 'مطاعم',
    governorateName: 'طرطوس',
  },
  {
    placeName: 'صيدلية الحياة',
    placeKind: 'pharmacy',
    categoryName: 'صيدليات',
    governorateName: 'الرياض',
  },
  {
    placeName: 'مطعم الشام',
    placeKind: 'restaurant',
    categoryName: 'مطاعم',
    governorateName: 'دمشق',
  },
  { placeName: 'مكتبة الفجر', placeKind: 'other', categoryName: 'مكتبات', governorateName: 'حمص' },
  {
    placeName: 'صيدلية الشفاء',
    placeKind: 'pharmacy',
    categoryName: 'صيدليات',
    governorateName: 'حلب',
  },
  {
    placeName: 'مطعم البحر',
    placeKind: 'restaurant',
    categoryName: 'مطاعم',
    governorateName: 'اللاذقية',
  },
  { placeName: 'مقهى ديم', placeKind: 'other', categoryName: 'مقاهي', governorateName: 'طرطوس' },
];
const FAVORITE_OFFSETS_DAYS = [2, 5, 2, 9, 14, 21, 30];

const REVIEW_COMMENT =
  '"الخدمة ممتازة والمكان جميل جداً، أنصح بتجربة قسم العائلات. طاقم العمل متعاون ومواقف السيارات متوفرة بسهولة."';
const REVIEW_SEEDS: readonly Omit<UserReview, 'id' | 'reviewedAt' | 'rating'>[] = [
  {
    placeName: 'مطعم النخيل',
    categoryName: 'مطاعم',
    locationName: 'حي النخيل، الرياض',
    comment: REVIEW_COMMENT,
  },
  {
    placeName: 'مطعم النخيل',
    categoryName: 'مطاعم',
    locationName: 'حي النخيل، الرياض',
    comment: REVIEW_COMMENT,
  },
  {
    placeName: 'مقهى ديم',
    categoryName: 'مقاهي',
    locationName: 'الكورنيش، طرطوس',
    comment: '"قهوة رائعة وجلسة هادئة."',
  },
];
const REVIEW_OFFSETS_DAYS = [13, 20, 40];

function seedFromId(id: string): number {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
}

function notBefore(user: AppUser, moment: number): string {
  return new Date(Math.max(moment, new Date(user.registeredAt).getTime())).toISOString();
}

/** Fills the detail page with the design's sample content, timed around the given user. */
export function buildMockUserDetail(user: AppUser, now: Date): UserDetail {
  const next = createSeededRandom(seedFromId(user.id));
  const lastActive = new Date(user.lastActiveAt).getTime();
  const activities = ACTIVITY_SEEDS.map((seed, index) => ({
    ...seed,
    id: `${user.id}-activity-${index + 1}`,
    occurredAt: notBefore(user, lastActive - ACTIVITY_OFFSETS_MS[index]),
  }));
  const favoritePlaces = FAVORITE_SEEDS.map((seed, index) => ({
    ...seed,
    id: `${user.id}-favorite-${index + 1}`,
    savedAt: notBefore(user, now.getTime() - FAVORITE_OFFSETS_DAYS[index] * DAY_MS),
  }));
  const reviews = REVIEW_SEEDS.map((seed, index) => ({
    ...seed,
    id: `${user.id}-review-${index + 1}`,
    rating: index < 2 ? MAX_STARS : randomInt(next, 3, MAX_STARS),
    reviewedAt: notBefore(user, now.getTime() - REVIEW_OFFSETS_DAYS[index] * DAY_MS),
  }));
  return {
    user,
    stats: {
      searchCount: randomInt(next, EXTRA_SEARCHES.min, EXTRA_SEARCHES.max),
      viewedPlaceCount: randomInt(next, EXTRA_VIEWS.min, EXTRA_VIEWS.max),
      favoritePlaceCount: favoritePlaces.length,
      reviewCount: reviews.length,
    },
    activities,
    favoritePlaces,
    reviews,
  };
}
