import { LiveOwnerReview } from '../../../shared/data/live-owner-review';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewReportStatus } from '../models/owner-review-report-status';

const REPORT_STATUSES: readonly OwnerReviewReportStatus[] = [
  'none',
  'pending',
  'accepted',
  'rejected',
];

export function toOwnerReview(review: LiveOwnerReview): OwnerReview {
  const author = review.user ?? review.author;
  return {
    id: String(review.id),
    author: {
      id: String(author?.id ?? ''),
      name: author?.name ?? review.authorName ?? review.userName ?? '',
    },
    rating: review.rating ?? null,
    comment: review.comment ?? '',
    createdAt: review.createdAt ?? review.created_at ?? '',
    reportStatus: reportStatusOf(review.reportStatus ?? review.report?.status),
  };
}

function reportStatusOf(status: string | null | undefined): OwnerReviewReportStatus {
  return REPORT_STATUSES.find((known) => known === status) ?? 'none';
}
