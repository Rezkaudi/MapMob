import { LIVE_REVIEW, LIVE_REVIEWED_STORE, LIVE_REVIEWER } from '../testing/live-review-fixture';
import { toLiveReviewStatus, toReview, toReviewDetail } from './live-review-mapping';

const REPORTED = {
  ...LIVE_REVIEW,
  reports: [{ status: 'pending', reason: 'إساءة', description: 'ألفاظ', user: { name: 'سامر' } }],
};

describe('live review mapping', () => {
  it('reads a pending review as published, with the Arabic place name', () => {
    expect(toReview(LIVE_REVIEW)).toEqual({
      id: '7',
      userName: 'خولة',
      placeName: 'صيدلية الأمل',
      rating: 3,
      comment: 'جيد',
      createdAt: '2026-10-13T06:51:29.000000Z',
      status: 'published',
    });
  });

  it('reads a hidden review as hidden, and an open report as reported', () => {
    expect(toReview({ ...LIVE_REVIEW, status: 'hidden' }).status).toBe('hidden');
    expect(toReview(REPORTED).status).toBe('reported');
    expect(toReview({ ...REPORTED, reports: [{ status: 'rejected' }] }).status).toBe('published');
  });

  it('reads no stars and no comment as an unrated empty review', () => {
    const review = toReview({ ...LIVE_REVIEW, rating: 0, comment: null });

    expect(review.rating).toBeNull();
    expect(review.comment).toBe('');
  });

  it("fills the drawer from the review, its writer, its place and the writer's review count", () => {
    const detail = toReviewDetail(REPORTED, LIVE_REVIEWER, LIVE_REVIEWED_STORE, 4);

    expect(detail.place).toEqual({
      referenceNumber: 18,
      name: 'صيدلية الأمل',
      categoryName: 'صيدلية',
      governorateName: 'دمشق',
      areaName: 'المزة',
    });
    expect(detail.reviewer).toEqual({
      name: 'خولة',
      memberSince: '2026-10-04T19:19:01.000000Z',
      reviewCount: 4,
      isPhoneVerified: true,
    });
    expect(detail.report).toEqual({ reporterName: 'سامر', reason: 'إساءة', notes: 'ألفاظ' });
  });

  it('keeps the drawer open when the writer or the place cannot be read', () => {
    const detail = toReviewDetail(LIVE_REVIEW, null, null, 1);

    expect(detail.place.categoryName).toBe('');
    expect(detail.reviewer.name).toBe('خولة');
    expect(detail.report).toBeNull();
  });

  it('shows a review again with the status the server gives new reviews', () => {
    expect(toLiveReviewStatus('published')).toBe('pending');
    expect(toLiveReviewStatus('hidden')).toBe('hidden');
  });
});
