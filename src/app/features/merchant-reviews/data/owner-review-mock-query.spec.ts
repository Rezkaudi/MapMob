import { buildOwnerReview } from '../testing/owner-review-fixture';
import { queryOwnerReviews, summarizeOwnerReviews } from './owner-review-mock-query';

const NOW = new Date('2026-09-20T12:00:00.000Z');

const AHMAD = buildOwnerReview({
  id: 'r1',
  author: { id: 'user-1', name: 'أحمد جمال' },
  rating: 5,
  createdAt: '2026-09-15T10:00:00.000Z',
});
const SARA = buildOwnerReview({
  id: 'r2',
  author: { id: 'user-2', name: 'سارة علي' },
  rating: 2,
  createdAt: '2026-08-10T10:00:00.000Z',
  reportStatus: 'pending',
});
const OMAR = buildOwnerReview({
  id: 'r3',
  author: { id: 'user-3', name: 'عمر خالد' },
  rating: null,
  createdAt: '2026-09-01T10:00:00.000Z',
});
const REVIEWS = [AHMAD, SARA, OMAR];

describe('queryOwnerReviews', () => {
  it('pages the reviews', () => {
    const page = queryOwnerReviews(REVIEWS, { pageIndex: 1, pageSize: 2 });

    expect(page).toEqual({ items: [OMAR], totalCount: 3 });
  });

  it('searches by the name of the reviewer', () => {
    const page = queryOwnerReviews(REVIEWS, { pageIndex: 0, pageSize: 4, search: 'سارة' });

    expect(page.items).toEqual([SARA]);
  });

  it('keeps one number of stars and one report status', () => {
    expect(queryOwnerReviews(REVIEWS, { pageIndex: 0, pageSize: 4, rating: 5 }).items).toEqual([
      AHMAD,
    ]);
    expect(
      queryOwnerReviews(REVIEWS, { pageIndex: 0, pageSize: 4, reportStatus: 'pending' }).items,
    ).toEqual([SARA]);
  });

  it('keeps the reviews written inside the days asked for', () => {
    const page = queryOwnerReviews(REVIEWS, {
      pageIndex: 0,
      pageSize: 4,
      submittedFrom: '2026-09-01',
      submittedTo: '2026-09-14',
    });

    expect(page.items).toEqual([OMAR]);
  });

  it('sorts newest first when asked', () => {
    const page = queryOwnerReviews(REVIEWS, { pageIndex: 0, pageSize: 4, sort: 'newest' });

    expect(page.items.map((review) => review.id)).toEqual(['r1', 'r3', 'r2']);
  });
});

describe('summarizeOwnerReviews', () => {
  it('averages and counts the rated reviews and spreads them over 5 to 1 stars', () => {
    const summary = summarizeOwnerReviews(REVIEWS, NOW);

    expect(summary.averageRating).toBe(3.5);
    expect(summary.ratedCount).toBe(2);
    expect(summary.starCounts).toEqual([
      { stars: 5, count: 1 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ]);
  });

  it('counts every review of this month and of the month before', () => {
    const summary = summarizeOwnerReviews(REVIEWS, NOW);

    expect(summary.thisMonthCount).toBe(2);
    expect(summary.lastMonthCount).toBe(1);
  });

  it('gives an average of 0 when no review carries stars', () => {
    expect(summarizeOwnerReviews([OMAR], NOW).averageRating).toBe(0);
  });
});
