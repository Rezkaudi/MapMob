import { buildOwnerReviewSeed } from './owner-reviews-mock-seed';

const NOW = new Date('2026-09-20T12:00:00.000Z');

describe('buildOwnerReviewSeed', () => {
  const reviews = buildOwnerReviewSeed(NOW);

  it('spreads 128 reviews over the stars the design counts', () => {
    const countOf = (stars: number) => reviews.filter((review) => review.rating === stars).length;

    expect(reviews).toHaveLength(128);
    expect([5, 4, 3, 2, 1].map(countOf)).toEqual([85, 28, 9, 4, 2]);
  });

  it('writes 18 of them this month, 16 last month and none in the future', () => {
    const inMonth = (month: string) =>
      reviews.filter((review) => review.createdAt.startsWith(month)).length;

    expect(inMonth('2026-09')).toBe(18);
    expect(inMonth('2026-08')).toBe(16);
    expect(reviews.every((review) => new Date(review.createdAt) <= NOW)).toBe(true);
  });

  it('has a report waiting, one accepted and one rejected', () => {
    const statuses = new Set(reviews.map((review) => review.reportStatus));

    expect([...statuses].sort()).toEqual(['accepted', 'none', 'pending', 'rejected']);
  });

  it('gives every review its own id and is the same on every run', () => {
    expect(new Set(reviews.map((review) => review.id)).size).toBe(reviews.length);
    expect(buildOwnerReviewSeed(NOW)).toEqual(reviews);
  });
});
