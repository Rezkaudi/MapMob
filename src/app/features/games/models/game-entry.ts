import { GamePrize } from './game-prize';
import { GameStatus } from './game-status';

/** One game session, as a row of the games table. */
export interface GameEntry {
  readonly id: string;
  readonly name: string;
  /** Given by the server, one more than the last game. */
  readonly roundNumber: number;
  /** ISO moment. */
  readonly startsAt: string;
  /** IANA name, e.g. "Asia/Damascus"; times are shown in it. */
  readonly timeZone: string;
  readonly questionCount: number;
  readonly participantCount: number;
  readonly prize: GamePrize;
  readonly status: GameStatus;
}
