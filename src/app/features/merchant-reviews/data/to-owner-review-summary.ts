import { OwnerReviewSummary } from '../models/owner-review-summary';
import { LiveOwnerReviewSummary } from './live-owner-review-summary';

const MOST_STARS = 5;

export function toOwnerReviewSummary(summary: LiveOwnerReviewSummary): OwnerReviewSummary {
  return {
    averageRating: summary.averageRating,
    ratedCount: summary.trustedReviewCount,
    starCounts: summary.starDistribution.map((row, index) => ({
      stars: row.stars ?? MOST_STARS - index,
      count: row.count,
    })),
    thisMonthCount: summary.monthly.newReviews,
    lastMonthCount: summary.monthly.previousComparablePeriodReviews,
  };
}
