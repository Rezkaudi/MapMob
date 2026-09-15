import { formatArabicDateTime } from '../../../shared/formatting/arabic-date-time';
import { getNameInitials } from '../../../shared/formatting/name-initials';
import { ReviewDetail } from '../models/review-detail';
import { ReviewStatus } from '../models/review-status';
import { Reviewer } from '../models/reviewer';
import { formatReviewRating } from './review-rating-label';

const TITLE_WITH_REPORT = 'تفاصيل المراجعة والبلاغ';
const TITLE_WITHOUT_REPORT = 'تفاصيل المراجعة';
const META_SEPARATOR = ' · ';
const MONTH_YEAR_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Which decision buttons the drawer footer offers. */
export type ReviewModeration = 'settleReport' | 'hide' | 'show';

const MODERATION_BY_STATUS: Record<ReviewStatus, ReviewModeration> = {
  reported: 'settleReport',
  published: 'hide',
  hidden: 'show',
};

export interface ReviewDetailView {
  readonly title: string;
  readonly hasReport: boolean;
  readonly placeReferenceLabel: string;
  readonly placeMetaLabel: string;
  readonly reviewerInitials: string;
  readonly reviewerMetaLabel: string;
  readonly ratingLabel: string | null;
  readonly submittedLabel: string;
  readonly moderation: ReviewModeration;
}

function describeReviewer(reviewer: Reviewer): string {
  const member = reviewer.isPhoneVerified ? 'عضو موثق' : 'عضو';
  const since = MONTH_YEAR_FORMAT.format(new Date(reviewer.memberSince));
  return `${member} منذ ${since}${META_SEPARATOR}${reviewer.reviewCount} تقييم`;
}

export function buildReviewDetailView(detail: ReviewDetail): ReviewDetailView {
  const { review, place, reviewer, report } = detail;
  const ratingLabel = formatReviewRating(review.rating);
  return {
    title: report ? TITLE_WITH_REPORT : TITLE_WITHOUT_REPORT,
    hasReport: report !== null,
    placeReferenceLabel: `ID: #${place.referenceNumber}`,
    placeMetaLabel: `${place.categoryName}${META_SEPARATOR}${place.governorateName}،${place.areaName}`,
    reviewerInitials: getNameInitials(reviewer.name),
    reviewerMetaLabel: describeReviewer(reviewer),
    ratingLabel: ratingLabel ? `(${ratingLabel})` : null,
    submittedLabel: `تاريخ الإرسال: ${formatArabicDateTime(new Date(review.createdAt))}`,
    moderation: MODERATION_BY_STATUS[review.status],
  };
}
