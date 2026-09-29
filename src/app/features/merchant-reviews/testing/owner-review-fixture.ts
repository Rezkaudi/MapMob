import { OwnerReview } from '../models/owner-review';
import { OwnerReviewSummary } from '../models/owner-review-summary';

export function buildOwnerReview(overrides: Partial<OwnerReview> = {}): OwnerReview {
  return {
    id: 'review-1',
    author: { id: 'user-1', name: 'أحمد جمال' },
    rating: 5,
    comment: 'الخدمة كانت ممتازة والتعامل راقي جداً، وفروا لي دواء نادر بسرعة فائقة.',
    createdAt: '2026-09-15T10:00:00.000Z',
    reportStatus: 'none',
    ...overrides,
  };
}

/** The numbers the "rating" frame draws. */
export function buildOwnerReviewSummary(
  overrides: Partial<OwnerReviewSummary> = {},
): OwnerReviewSummary {
  return {
    averageRating: 4.6,
    ratedCount: 128,
    starCounts: [
      { stars: 5, count: 85 },
      { stars: 4, count: 28 },
      { stars: 3, count: 9 },
      { stars: 2, count: 4 },
      { stars: 1, count: 2 },
    ],
    thisMonthCount: 18,
    lastMonthCount: 16,
    ...overrides,
  };
}
