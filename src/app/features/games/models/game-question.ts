import { GameOption } from './game-option';

export interface GameQuestion {
  readonly id: string;
  readonly text: string;
  /** Always two: the first and the second choice. */
  readonly options: readonly GameOption[];
}
