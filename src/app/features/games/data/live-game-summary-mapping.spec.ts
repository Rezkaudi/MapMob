import { buildGame, buildWinner } from '../testing/game-fixture';
import { toGameSummary } from './live-game-summary-mapping';

const NOW = new Date('2026-11-01T00:00:00Z');
const COUNTS = { total: 4, draft: 1, scheduled: 2, active: 0, completed: 1 };

describe('toGameSummary', () => {
  it('takes the counts from the server and the rest from the lists', () => {
    const past = buildGame({ id: '1', startsAt: '2026-10-01T15:00:00Z' });
    const later = buildGame({ id: '3', startsAt: '2026-12-20T15:00:00Z' });
    const next = buildGame({ id: '2', startsAt: '2026-12-01T15:00:00Z' });
    const winners = [
      buildWinner({ deliveryStatus: 'delivered' }),
      buildWinner({ id: 'w2', deliveryStatus: 'pending' }),
    ];

    expect(toGameSummary(COUNTS, [past, later, next], winners, NOW)).toEqual({
      gameCount: 4,
      scheduledCount: 2,
      finishedCount: 1,
      participantCount: 0,
      winnerCount: 2,
      deliveredPrizeCount: 1,
      upcomingGame: next,
    });
  });

  it('has no upcoming game when none is scheduled ahead', () => {
    expect(toGameSummary(COUNTS, [], [], NOW).upcomingGame).toBeNull();
  });
});
