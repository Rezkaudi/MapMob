import { GameEntry } from './game-entry';
import { GameQuestion } from './game-question';

export interface GameDetail extends GameEntry {
  readonly description: string | null;
  /** How long players have to vote on each question. */
  readonly voteSeconds: number;
  /** null = no cap. */
  readonly maxPlayerCount: number | null;
  readonly questions: readonly GameQuestion[];
  readonly winnerCount: number;
  readonly deliveredPrizeCount: number;
}
