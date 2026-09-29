import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';

const STAR_STEPS = [5, 4, 3, 2, 1] as const;
const AVERAGE_PRECISION = 10;
/** `yyyy-mm` of a `yyyy-mm-dd` calendar day. */
const MONTH_LENGTH = 7;

export function queryOwnerReviews(
  reviews: readonly OwnerReview[],
  query: OwnerReviewQuery,
): PagedResult<OwnerReview> {
  const matching = reviews.filter((review) => matchesQuery(review, query));
  const sorted = sortListEntries(
    matching,
    query.sort,
    (review) => review.createdAt,
    (review) => review.author.name,
  );
  return paginate(sorted, query.pageIndex, query.pageSize);
}

export function summarizeOwnerReviews(
  reviews: readonly OwnerReview[],
  now: Date,
): OwnerReviewSummary {
  const ratings = reviews.map((review) => review.rating).filter((rating) => rating !== null);
  const thisMonth = monthOf(toCalendarDay(now));
  const lastMonth = monthOf(toCalendarDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
  return {
    averageRating: averageOf(ratings),
    ratedCount: ratings.length,
    starCounts: STAR_STEPS.map((stars) => ({
      stars,
      count: ratings.filter((rating) => rating === stars).length,
    })),
    thisMonthCount: reviews.filter((review) => submittedMonthOf(review) === thisMonth).length,
    lastMonthCount: reviews.filter((review) => submittedMonthOf(review) === lastMonth).length,
  };
}

function matchesQuery(review: OwnerReview, query: OwnerReviewQuery): boolean {
  const search = query.search?.trim();
  const day = submittedDayOf(review);
  return (
    (!search || review.author.name.includes(search)) &&
    (query.rating === undefined || review.rating === query.rating) &&
    (!query.reportStatus || review.reportStatus === query.reportStatus) &&
    (!query.submittedFrom || day >= query.submittedFrom) &&
    (!query.submittedTo || day <= query.submittedTo)
  );
}

function averageOf(ratings: readonly number[]): number {
  if (ratings.length === 0) {
    return 0;
  }
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * AVERAGE_PRECISION) / AVERAGE_PRECISION;
}

function submittedDayOf(review: OwnerReview): string {
  return toCalendarDay(new Date(review.createdAt));
}

function submittedMonthOf(review: OwnerReview): string {
  return monthOf(submittedDayOf(review));
}

function monthOf(day: string): string {
  return day.slice(0, MONTH_LENGTH);
}
