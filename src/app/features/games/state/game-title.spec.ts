import { formatGameTitle, formatRoundLabel } from './game-title';

describe('game title', () => {
  const game = { name: 'الأكثرية والأقلية', roundNumber: 104 };

  it('names the round with its number', () => {
    expect(formatRoundLabel(game)).toBe('الجولة #104');
  });

  it('joins the name and round with a dash', () => {
    expect(formatGameTitle(game)).toBe('الأكثرية والأقلية — الجولة #104');
  });
});
