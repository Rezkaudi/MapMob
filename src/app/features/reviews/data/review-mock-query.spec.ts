import { buildReview } from '../testing/review-fixture';
import { queryReviews, summarizeReviews } from './review-mock-query';

const NOW = new Date(2026, 8, 15, 12, 0);
const AHMAD = buildReview({
  id: 'r1',
  userName: 'أحمد جمال',
  placeName: 'صيدلية الحياة',
  rating: 5,
  createdAt: new Date(2026, 8, 12).toISOString(),
});
const SARA = buildReview({
  id: 'r2',
  userName: 'سارة محمد',
  placeName: 'صيدلية الشفاء',
  rating: 2,
  comment: 'الخدمة كانت بطيئة',
  status: 'reported',
  createdAt: new Date(2026, 7, 1).toISOString(),
});
const KHALED = buildReview({
  id: 'r3',
  userName: 'خالد إبراهيم',
  placeName: 'مطعم الأصالة',
  rating: null,
  status: 'hidden',
  createdAt: new Date(2025, 0, 5).toISOString(),
});
const MONA = buildReview({
  id: 'r4',
  userName: 'منى عبد الله',
  placeName: 'مقهى الزاوية',
  rating: 4,
  createdAt: new Date(2026, 8, 14).toISOString(),
});
const REVIEWS = [AHMAD, SARA, KHALED, MONA];
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

describe('queryReviews', () => {
  it('pages the reviews', () => {
    expect(queryReviews(REVIEWS, { pageIndex: 1, pageSize: 3 })).toEqual({
      items: [MONA],
      totalCount: 4,
    });
  });

  it('searches the reviewer, the place and the comment', () => {
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, search: 'سارة' }).items).toEqual([SARA]);
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, search: 'الأصالة' }).items).toEqual([KHALED]);
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, search: 'بطيئة' }).items).toEqual([SARA]);
  });

  it('filters by stars the way each rating button reads', () => {
    const itemsFor = (rating: Parameters<typeof queryReviews>[1]['rating']) =>
      queryReviews(REVIEWS, { ...FIRST_PAGE, rating }).items;

    expect(itemsFor('fiveStars')).toEqual([AHMAD]);
    expect(itemsFor('fourStarsAndUp')).toEqual([AHMAD, MONA]);
    expect(itemsFor('twoStars')).toEqual([SARA]);
    expect(itemsFor('threeStars')).toEqual([]);
    expect(itemsFor('unrated')).toEqual([KHALED]);
  });

  it('filters by status, place and submission days', () => {
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, status: 'hidden' }).items).toEqual([KHALED]);
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, placeName: 'صيدلية' }).items).toEqual([
      AHMAD,
      SARA,
    ]);
    expect(
      queryReviews(REVIEWS, {
        ...FIRST_PAGE,
        submittedFrom: '2026-08-01',
        submittedTo: '2026-09-12',
      }).items,
    ).toEqual([AHMAD, SARA]);
  });

  it('sorts by submission date or by reviewer name', () => {
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, sort: 'newest' }).items).toEqual([
      MONA,
      AHMAD,
      SARA,
      KHALED,
    ]);
    expect(queryReviews(REVIEWS, { ...FIRST_PAGE, sort: 'name' }).items[0]).toEqual(AHMAD);
  });
});

describe('summarizeReviews', () => {
  it('counts all, the reported and the last seven days, and averages the starred ones', () => {
    expect(summarizeReviews(REVIEWS, NOW)).toEqual({
      totalCount: 4,
      averageRating: 3.7,
      newCount: 2,
      reportedCount: 1,
    });
  });

  it('averages to zero when no review has stars', () => {
    expect(summarizeReviews([KHALED], NOW).averageRating).toBe(0);
  });
});
