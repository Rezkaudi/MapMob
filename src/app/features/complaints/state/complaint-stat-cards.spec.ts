import { buildComplaintStatCards } from './complaint-stat-cards';

const SUMMARY = {
  totalCount: 248,
  newCount: 32,
  inReviewCount: 10,
  resolvedCount: 20,
  rejectedCount: 10,
};

describe('buildComplaintStatCards', () => {
  it('leads with the total on the right, then the statuses in the design order', () => {
    const cards = buildComplaintStatCards(SUMMARY);

    expect(cards.map((card) => [card.label, card.value])).toEqual([
      ['إجمالي البلاغات', '248'],
      ['جديد', '32'],
      ['قيد المراجعة', '10'],
      ['مرفوض', '10'],
      ['تم الحل', '20'],
    ]);
  });

  it('gives the total the icon tile and each status its coloured dot', () => {
    const cards = buildComplaintStatCards(SUMMARY);

    expect(cards[0]).toMatchObject({ icon: 'complaints', dotTone: null });
    expect(cards.slice(1).map((card) => card.dotTone)).toEqual([
      'primary',
      'warning',
      'error',
      'success',
    ]);
  });

  it('shows zeros while the summary is missing', () => {
    expect(buildComplaintStatCards(null).every((card) => card.value === '0')).toBe(true);
  });
});
