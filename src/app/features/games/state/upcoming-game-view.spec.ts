import { buildGame } from '../testing/game-fixture';
import { toUpcomingGameView } from './upcoming-game-view';

describe('toUpcomingGameView', () => {
  it('writes the title, the start with the days left, and the prize', () => {
    const view = toUpcomingGameView(buildGame(), new Date('2026-10-11T09:00:00.000Z'));
    expect(view.gameId).toBe('game-104');
    expect(view.title).toBe('الأكثرية والأقلية — الجولة #104');
    expect(view.scheduleText).toBe('15 أكتوبر 2026 — 18:00 (بعد 4 أيام)');
    expect(view.prizeText).toBe('50,000 ل.س جائزة نقدية');
    expect(view.statusText).toBe('اللعبة القادمة • مجدولة');
  });
});
