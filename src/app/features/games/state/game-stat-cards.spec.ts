import { buildSummary } from '../testing/game-fixture';
import { buildGameStatCards } from './game-stat-cards';

describe('buildGameStatCards', () => {
  it('leads with the game total, as RTL puts the first card on the right', () => {
    const cards = buildGameStatCards(buildSummary());
    expect(cards.map((card) => card.label)).toEqual([
      'إجمالي الألعاب',
      'إجمالي المشاركين',
      'عدد الفائزين',
      'الجوائز المسلّمة',
    ]);
    expect(cards.map((card) => card.value)).toEqual(['120', '120', '25', '20']);
  });

  it('writes the note beside each value, the delivered card out of every winner', () => {
    const cards = buildGameStatCards(buildSummary({ winnerCount: 25 }));
    expect(cards.map((card) => card.note)).toEqual([
      'منذ انطلاق التطبيق',
      'منذ انطلاق اللعبة',
      'منذ انطلاق التطبيق',
      'من أصل 25 فائز',
    ]);
  });

  it('shows zeros before the summary arrives', () => {
    expect(buildGameStatCards(null).map((card) => card.value)).toEqual(['0', '0', '0', '0']);
  });
});
