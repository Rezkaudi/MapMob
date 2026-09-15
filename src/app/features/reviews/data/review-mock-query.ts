import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { Review } from '../models/review';
import { ReviewQuery } from '../models/review-query';
import { ReviewRatingFilter } from '../models/review-rating-filter';
import { ReviewSummary } from '../models/review-summary';

/** "New" counts the last seven days, today included. */
const NEW_REVIEW_DAYS_BACK = 6;
const AVERAGE_PRECISION = 10;

type RatingMatcher = (rating: number | null) => boolean;

const RATING_MATCHERS: Record<ReviewRatingFilter, RatingMatcher> = {
  fiveStars: (rating) => rating === 5,
  fourStarsAndUp: (rating) => rating !== null && rating >= 4,
  threeStars: (rating) => rating === 3,
  twoStars: (rating) => rating === 2,
  oneStar: (rating) => rating === 1,
  unrated: (rating) => rating === null,
};

export function filterReviews(reviews: readonly Review[], query: ReviewQuery): readonly Review[] {
  const matching = reviews.filter((review) => matchesFilters(review, query));
  return sortListEntries(
    matching,
    query.sort,
    (review) => review.createdAt,
    (review) => review.userName,
  );
}

export function queryReviews(reviews: readonly Review[], query: ReviewQuery): PagedResult<Review> {
  return paginate(filterReviews(reviews, query), query.pageIndex, query.pageSize);
}

export function summarizeReviews(reviews: readonly Review[], now: Date): ReviewSummary {
  const ratings = reviews.map((review) => review.rating).filter((rating) => rating !== null);
  const firstNewDay = addCalendarDays(toCalendarDay(now), -NEW_REVIEW_DAYS_BACK);
  return {
    totalCount: reviews.length,
    averageRating: averageOf(ratings),
    newCount: reviews.filter((review) => submittedDayOf(review) >= firstNewDay).length,
    reportedCount: reviews.filter((review) => review.status === 'reported').length,
  };
}

function averageOf(ratings: readonly number[]): number {
  if (ratings.length === 0) {
    return 0;
  }
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * AVERAGE_PRECISION) / AVERAGE_PRECISION;
}

function submittedDayOf(review: Review): string {
  return toCalendarDay(new Date(review.createdAt));
}

function includesText(value: string, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || value.includes(term);
}

function matchesSearch(review: Review, search: string | undefined): boolean {
  return [review.userName, review.placeName, review.comment].some((field) =>
    includesText(field, search),
  );
}

function matchesSubmission(review: Review, query: ReviewQuery): boolean {
  const day = submittedDayOf(review);
  if (query.submittedFrom && day < query.submittedFrom) {
    return false;
  }
  return !query.submittedTo || day <= query.submittedTo;
}

function matchesFilters(review: Review, query: ReviewQuery): boolean {
  if (query.rating && !RATING_MATCHERS[query.rating](review.rating)) {
    return false;
  }
  if (query.status && review.status !== query.status) {
    return false;
  }
  return (
    includesText(review.placeName, query.placeName) &&
    matchesSearch(review, query.search) &&
    matchesSubmission(review, query)
  );
}
