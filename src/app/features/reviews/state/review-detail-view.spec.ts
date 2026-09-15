import { buildReview, buildReviewDetail } from '../testing/review-fixture';
import { buildReviewDetailView } from './review-detail-view';

const REPORTED = buildReviewDetail({
  review: buildReview({
    id: 'review-2',
    status: 'reported',
    rating: 2,
    createdAt: new Date(2026, 8, 7, 20, 42).toISOString(),
  }),
});

describe('buildReviewDetailView', () => {
  it('words a reported review the way the drawer frame does', () => {
    expect(buildReviewDetailView(REPORTED)).toEqual({
      title: 'تفاصيل المراجعة والبلاغ',
      hasReport: true,
      placeReferenceLabel: 'ID: #4920',
      placeMetaLabel: 'صيدلية · طرطوس،طرطوس المدينة',
      reviewerInitials: 'س م',
      reviewerMetaLabel: 'عضو موثق منذ يناير 2024 · 14 تقييم',
      ratingLabel: '(2.0)',
      submittedLabel: 'تاريخ الإرسال: الإثنين 07 سبتمبر 2026 - الساعة 08:42 مساءً',
      moderation: 'settleReport',
    });
  });

  it('offers to hide a published review and to show a hidden one, without a report', () => {
    const published = buildReviewDetailView(
      buildReviewDetail({ review: buildReview({ status: 'published' }), report: null }),
    );
    const hidden = buildReviewDetailView(
      buildReviewDetail({ review: buildReview({ status: 'hidden' }), report: null }),
    );

    expect(published.title).toBe('تفاصيل المراجعة');
    expect(published.hasReport).toBe(false);
    expect(published.moderation).toBe('hide');
    expect(hidden.moderation).toBe('show');
  });

  it('leaves out the stars label for a review without stars, and "موثق" for an unverified member', () => {
    const view = buildReviewDetailView(
      buildReviewDetail({
        review: buildReview({ rating: null }),
        reviewer: { ...REPORTED.reviewer, isPhoneVerified: false, reviewCount: 3 },
      }),
    );

    expect(view.ratingLabel).toBeNull();
    expect(view.reviewerMetaLabel).toBe('عضو منذ يناير 2024 · 3 تقييم');
  });
});
