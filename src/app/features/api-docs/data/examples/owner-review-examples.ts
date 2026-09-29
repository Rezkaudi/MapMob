import type { OwnerReview } from '../../../merchant-reviews/models/owner-review';
import type { OwnerReviewSummary } from '../../../merchant-reviews/models/owner-review-summary';
import type { ReviewReport } from '../../../merchant-reviews/models/review-report';

export const OWNER_REVIEW_ROW = {
  id: 'r41',
  author: { id: '5', name: 'أحمد جمال' },
  rating: 5,
  comment: 'الخدمة كانت ممتازة والتعامل راقي جداً، وفروا لي دواء نادر بسرعة فائقة.',
  createdAt: '2026-09-15T10:00:00Z',
  reportStatus: 'none',
} satisfies OwnerReview;

export const OWNER_REVIEW_SUMMARY = {
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
} satisfies OwnerReviewSummary;

export const OWNER_REVIEW_REPORT = {
  reason: 'fake',
  notes: 'لم يزر هذا الشخص المتجر في التاريخ المذكور.',
} satisfies ReviewReport;

export const OWNER_REVIEW_REPORTED = {
  ...OWNER_REVIEW_ROW,
  reportStatus: 'pending',
} satisfies OwnerReview;
