import { formatArabicRelativeTime } from '../../../shared/formatting/arabic-relative-time';
import { LatinDigitDatePipe } from '../../../shared/pipes/latin-digit-date.pipe';
import { FavoritePlace } from '../models/favorite-place';
import { PlaceKind } from '../models/place-kind';
import { UserActivity } from '../models/user-activity';
import { UserActivityStats } from '../models/user-activity-stats';
import { UserActivityType } from '../models/user-activity-type';
import { UserReview } from '../models/user-review';
import { UserStatCard } from './user-stat-cards';

interface Tile {
  readonly icon: string;
  readonly tileClass: string;
}

const ACTIVITY_TILES: Record<UserActivityType, Tile> = {
  search: { icon: 'search-rounded', tileClass: 'bg-primary' },
  favorite: { icon: 'heart-rounded', tileClass: 'bg-status-error' },
  review: { icon: 'star-rounded', tileClass: 'bg-[#fea619]' },
  share: { icon: 'share', tileClass: 'bg-status-success' },
};

const PLACE_TILES: Record<PlaceKind, Tile> = {
  restaurant: { icon: 'utensils-crossed', tileClass: 'bg-[#ff8104]' },
  pharmacy: { icon: 'pills', tileClass: 'bg-[#006f69]' },
  other: { icon: 'building', tileClass: 'bg-primary' },
};

const META_SEPARATOR = ' · ';
const DATE_PIPE = new LatinDigitDatePipe();
const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export interface ActivityRow extends Tile {
  readonly id: string;
  readonly description: string;
  readonly timeLabel: string;
}

export interface FavoriteRow extends Tile {
  readonly id: string;
  readonly placeName: string;
  readonly metaLabel: string;
  readonly savedLabel: string;
}

export interface ReviewRow {
  readonly id: string;
  readonly placeName: string;
  readonly metaLabel: string;
  readonly comment: string;
  readonly dateLabel: string;
  readonly rating: number;
}

export function buildDetailStatCards(stats: UserActivityStats): readonly UserStatCard[] {
  const count = (value: number) => NUMBER_FORMAT.format(value);
  return [
    { label: 'عمليات البحث', value: count(stats.searchCount), icon: 'users' },
    { label: 'الأماكن التي تمت مشاهدتها', value: count(stats.viewedPlaceCount), icon: 'building' },
    { label: 'الأماكن المفضلة', value: count(stats.favoritePlaceCount), icon: 'heart-rounded' },
    { label: 'التقييمات المضافة', value: count(stats.reviewCount), icon: 'star-rounded' },
  ];
}

export function buildActivityRows(
  activities: readonly UserActivity[],
  now: Date,
): readonly ActivityRow[] {
  return activities.map((activity) => ({
    id: activity.id,
    description: activity.description,
    timeLabel: formatArabicRelativeTime(activity.occurredAt, now),
    ...ACTIVITY_TILES[activity.type],
  }));
}

export function buildFavoriteRows(
  favorites: readonly FavoritePlace[],
  now: Date,
): readonly FavoriteRow[] {
  return favorites.map((favorite) => ({
    id: favorite.id,
    placeName: favorite.placeName,
    metaLabel: [favorite.categoryName, favorite.governorateName].join(META_SEPARATOR),
    savedLabel: formatArabicRelativeTime(favorite.savedAt, now),
    ...PLACE_TILES[favorite.placeKind],
  }));
}

export function buildReviewRows(reviews: readonly UserReview[]): readonly ReviewRow[] {
  return reviews.map((review) => ({
    id: review.id,
    placeName: review.placeName,
    metaLabel: `تصنيف: ${[review.categoryName, review.locationName].join(META_SEPARATOR)}`,
    comment: review.comment,
    dateLabel: `تاريخ التقييم: ${DATE_PIPE.transform(review.reviewedAt)}`,
    rating: review.rating,
  }));
}
