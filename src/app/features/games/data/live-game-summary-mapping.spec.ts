import { buildGame } from '../testing/game-fixture';
import { toGameSummary } from './live-game-summary-mapping';

const COUNTS = { total: 4, draft: 1, scheduled: 2, active: 0, completed: 1 };

describe('toGameSummary', () => {
  it('takes every count from the server summary and the next game from the server', () => {
    const next = buildGame({ id: '2', startsAt: '2026-12-01T15:00:00Z' });

    expect(
      toGameSummary({ ...COUNTS, winnerCount: 2, deliveredPrizeCount: 1 }, next),
    ).toEqual({
      gameCount: 4,
      scheduledCount: 2,
      finishedCount: 1,
      participantCount: 0,
      winnerCount: 2,
      deliveredPrizeCount: 1,
      upcomingGame: next,
    });
  });

  it('shows zero winners while the server does not count them', () => {
    const summary = toGameSummary(COUNTS, null);

    expect(summary.winnerCount).toBe(0);
    expect(summary.deliveredPrizeCount).toBe(0);
    expect(summary.upcomingGame).toBeNull();
  });
});
