import { buildOwnerReviewSummary } from '../testing/owner-review-fixture';
import { buildRatingSummaryView } from './rating-summary-view';

describe('buildRatingSummaryView', () => {
  it('writes the score, its stars and what it is based on', () => {
    const view = buildRatingSummaryView(buildOwnerReviewSummary());

    expect(view.averageText).toBe('4.6');
    expect(view.filledStarCount).toBe(5);
    expect(view.basisText).toBe('بناءً على 128 تقييماً موثقاً');
  });

  it('counts each number of stars with its share of the rated reviews', () => {
    const view = buildRatingSummaryView(buildOwnerReviewSummary());

    expect(view.starRows.map((row) => [row.stars, row.countText])).toEqual([
      [5, '85 (66%)'],
      [4, '28 (22%)'],
      [3, '9 (7%)'],
      [2, '4 (3.1%)'],
      [1, '2 (1.6%)'],
    ]);
    expect(view.starRows[0].sharePercent).toBeCloseTo(66.41, 2);
  });

  it('draws empty bars before the first rating', () => {
    const view = buildRatingSummaryView(
      buildOwnerReviewSummary({
        averageRating: 0,
        ratedCount: 0,
        starCounts: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
      }),
    );

    expect(view.averageText).toBe('0.0');
    expect(view.filledStarCount).toBe(0);
    expect(view.starRows[0]).toEqual({ stars: 5, countText: '0 (0%)', sharePercent: 0 });
  });

  it('says how many reviews came this month and how that compares with last month', () => {
    expect(buildRatingSummaryView(buildOwnerReviewSummary()).month).toEqual({
      countText: '18 تقييماً جديداً',
      change: { text: '+13%', isRising: true },
    });
    expect(
      buildRatingSummaryView(buildOwnerReviewSummary({ thisMonthCount: 8, lastMonthCount: 10 }))
        .month.change,
    ).toEqual({ text: '-20%', isRising: false });
  });

  it('leaves the change out when last month had no reviews to compare with', () => {
    const view = buildRatingSummaryView(
      buildOwnerReviewSummary({ thisMonthCount: 1, lastMonthCount: 0 }),
    );

    expect(view.month).toEqual({ countText: 'تقييم جديد واحد', change: null });
  });
});
