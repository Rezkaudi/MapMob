import { buildReviewSeed } from './review-mock-seed';

const NOW = new Date(2026, 8, 15, 12, 0);

describe('buildReviewSeed', () => {
  it('builds the same reviews every time, never in the future', () => {
    const first = buildReviewSeed(NOW, 60);
    const second = buildReviewSeed(NOW, 60);

    expect(first).toHaveLength(60);
    expect(first).toEqual(second);
    expect(first.every((detail) => new Date(detail.review.createdAt) <= NOW)).toBe(true);
    expect(
      first.every(
        (detail) => new Date(detail.reviewer.memberSince) <= new Date(detail.review.createdAt),
      ),
    ).toBe(true);
  });

  it('keeps a report exactly on the reported reviews, and mixes stars and statuses', () => {
    const details = buildReviewSeed(NOW, 3000);

    expect(
      details.every((detail) => (detail.report !== null) === (detail.review.status === 'reported')),
    ).toBe(true);
    expect(details.filter((detail) => detail.review.status === 'reported')).toHaveLength(4);
    expect(new Set(details.map((detail) => detail.review.status))).toEqual(
      new Set(['published', 'reported', 'hidden']),
    );
    expect(details.some((detail) => detail.review.rating === null)).toBe(true);
    expect(
      details.every(
        (detail) =>
          detail.review.rating === null || (detail.review.rating >= 1 && detail.review.rating <= 5),
      ),
    ).toBe(true);
  });

  it('starts with the two sample reviews the design draws', () => {
    const [first, second] = buildReviewSeed(NOW, 3);

    expect(first.review).toMatchObject({
      userName: 'أحمد جمال',
      placeName: 'صيدلية الحياة',
      rating: 5,
      status: 'published',
    });
    expect(second.review).toMatchObject({
      userName: 'سارة محمد',
      placeName: 'صيدلية الشفاء',
      rating: 2,
      status: 'reported',
    });
    expect(second.place.referenceNumber).toBe(4920);
    expect(second.report?.reporterName).toBe('إدارة صيدلية الشفاء');
  });
});
