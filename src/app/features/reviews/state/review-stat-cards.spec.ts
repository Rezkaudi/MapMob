import { buildReviewStatCards } from './review-stat-cards';

describe('buildReviewStatCards', () => {
  it('builds the four cards right to left, as the design does', () => {
    expect(
      buildReviewStatCards({
        totalCount: 3000,
        averageRating: 4.3,
        newCount: 14,
        reportedCount: 4,
      }),
    ).toEqual([
      { label: 'إجمالي التقييمات', value: '3,000', icon: 'star-rounded', alert: null },
      { label: 'متوسط التقييم العام', value: '4.3', icon: 'star-rounded', alert: null },
      { label: 'التقييمات الجديدة', value: '14', icon: 'star-rounded', alert: null },
      { label: 'مبلغ عنها', value: '4', icon: 'star-rounded', alert: 'تتطلب إجراء' },
    ]);
  });

  it('drops the "تتطلب إجراء" chip once nothing is reported, and shows zeros before the summary', () => {
    const cards = buildReviewStatCards(null);

    expect(cards.map((card) => card.value)).toEqual(['0', '0.0', '0', '0']);
    expect(cards.every((card) => card.alert === null)).toBe(true);
  });
});
