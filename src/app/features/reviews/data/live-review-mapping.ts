import { ModeratedReviewStatus, ReviewStatus } from '../models/review-status';
import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ReviewReport } from '../models/review-report';
import { LiveReview, LiveReviewReport } from './live-review';
import { LiveReviewedStore, LiveReviewer } from './live-review-people';

const HIDDEN_STATUS = 'hidden';
const OPEN_REPORT_STATUS = 'pending';
// The server refuses "published"; a new, visible review is "pending" there.
const LIVE_STATUS: Record<ModeratedReviewStatus, string> = {
  published: 'pending',
  hidden: HIDDEN_STATUS,
};

function findOpenReport(review: LiveReview): LiveReviewReport | null {
  return (
    review.reports.find((report) => !report.status || report.status === OPEN_REPORT_STATUS) ?? null
  );
}

function toReviewStatus(review: LiveReview): ReviewStatus {
  if (review.status === HIDDEN_STATUS) {
    return 'hidden';
  }
  return findOpenReport(review) ? 'reported' : 'published';
}

function placeNameOf(review: LiveReview): string {
  return review.store?.name.ar ?? review.store?.name.en ?? '';
}

export function toLiveReviewStatus(status: ModeratedReviewStatus): string {
  return LIVE_STATUS[status];
}

export function toReview(review: LiveReview): Review {
  return {
    id: String(review.id),
    userName: review.user?.name ?? '',
    placeName: placeNameOf(review),
    rating: review.rating ? review.rating : null,
    comment: review.comment ?? '',
    createdAt: review.created_at,
    status: toReviewStatus(review),
  };
}

function toReviewReport(report: LiveReviewReport | null): ReviewReport | null {
  if (!report) {
    return null;
  }
  return {
    reporterName: report.user?.name ?? '',
    reason: report.reason ?? '',
    notes: report.description ?? report.notes ?? '',
  };
}

export function toReviewDetail(
  review: LiveReview,
  reviewer: LiveReviewer | null,
  store: LiveReviewedStore | null,
  reviewerReviewCount: number,
): ReviewDetail {
  return {
    review: toReview(review),
    place: {
      referenceNumber: review.store_id,
      name: placeNameOf(review),
      categoryName: store?.mainCategory?.name ?? '',
      governorateName: store?.location?.governorate?.name ?? '',
      areaName: store?.location?.area?.name ?? '',
    },
    reviewer: {
      name: reviewer?.name ?? review.user?.name ?? '',
      memberSince: reviewer?.created_at ?? review.created_at,
      reviewCount: reviewerReviewCount,
      isPhoneVerified: Boolean(reviewer?.email_verified_at),
    },
    report: toReviewReport(findOpenReport(review)),
  };
}
