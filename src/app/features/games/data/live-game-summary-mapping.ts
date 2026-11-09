import { GameEntry } from '../models/game-entry';
import { GameSummary } from '../models/game-summary';
import { LiveGameSummary } from './live-game-summary';

// The server keeps no player count yet.
const UNKNOWN_PARTICIPANT_COUNT = 0;
const NOT_COUNTED = 0;

export function toGameSummary(counts: LiveGameSummary, upcomingGame: GameEntry | null): GameSummary {
  return {
    gameCount: counts.total,
    scheduledCount: counts.scheduled,
    finishedCount: counts.completed,
    participantCount: UNKNOWN_PARTICIPANT_COUNT,
    winnerCount: counts.winnerCount ?? NOT_COUNTED,
    deliveredPrizeCount: counts.deliveredPrizeCount ?? NOT_COUNTED,
    upcomingGame,
  };
}
