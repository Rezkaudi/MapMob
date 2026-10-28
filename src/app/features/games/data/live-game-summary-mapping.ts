import { GameEntry } from '../models/game-entry';
import { GameSummary } from '../models/game-summary';
import { GameWinner } from '../models/game-winner';
import { matchGames } from './game-list-query';
import { LiveGameSummary } from './live-game-summary';

// The server keeps no player count yet.
const UNKNOWN_PARTICIPANT_COUNT = 0;

function findUpcomingGame(games: readonly GameEntry[], now: Date): GameEntry | null {
  return (
    matchGames(games, { status: 'scheduled', sort: 'oldest' }).find(
      (game) => new Date(game.startsAt).getTime() > now.getTime(),
    ) ?? null
  );
}

/** The server counts the games; the winners and the next game come from the lists. */
export function toGameSummary(
  counts: LiveGameSummary,
  games: readonly GameEntry[],
  winners: readonly GameWinner[],
  now: Date,
): GameSummary {
  return {
    gameCount: counts.total,
    scheduledCount: counts.scheduled,
    finishedCount: counts.completed,
    participantCount: UNKNOWN_PARTICIPANT_COUNT,
    winnerCount: winners.length,
    deliveredPrizeCount: winners.filter((winner) => winner.deliveryStatus === 'delivered').length,
    upcomingGame: findUpcomingGame(games, now),
  };
}
