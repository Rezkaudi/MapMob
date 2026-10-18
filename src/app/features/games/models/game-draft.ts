import { GamePrize } from './game-prize';

export type GameSavedStatus = 'draft' | 'scheduled';

export interface GameQuestionDraft {
  readonly text: string;
  readonly options: readonly string[];
}

/** What the add and edit pages send. */
export interface GameDraft {
  readonly name: string;
  readonly description: string | null;
  /** ISO moment with the offset of `timeZone`. */
  readonly startsAt: string;
  readonly timeZone: string;
  readonly voteSeconds: number;
  readonly questions: readonly GameQuestionDraft[];
  readonly prize: GamePrize;
  readonly status: GameSavedStatus;
}
