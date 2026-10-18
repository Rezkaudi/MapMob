import { GameEntry } from './game-entry';

/** The numbers of the four cards and the status chips, and the game the banner shows. */
export interface GameSummary {
  readonly gameCount: number;
  readonly scheduledCount: number;
  readonly finishedCount: number;
  readonly participantCount: number;
  readonly winnerCount: number;
  readonly deliveredPrizeCount: number;
  /** The next game that has not started yet; `null` when none is planned. */
  readonly upcomingGame: GameEntry | null;
}
