import { GameQuestionView } from './game-question-view';

export interface GameDetailHighlight {
  readonly label: string;
  readonly value: string;
}

/** The four numbers a finished game shows under its summary. */
export interface GameDetailTiles {
  readonly participants: string;
  readonly winners: string;
  readonly prizeAmount: string;
  readonly prizeCurrency: string;
  readonly delivered: string;
  /** Written "/4" so the RTL line reads "2 من 4" with the 4 on the left. */
  readonly deliveredOutOf: string;
}

export interface GameDetailView {
  readonly title: string;
  readonly dayText: string;
  readonly clockText: string;
  readonly statusLabel: string;
  readonly pillClass: string;
  readonly questionCountText: string;
  readonly prizeKindLabel: string;
  /** The total for cash, the sponsor for a voucher. */
  readonly highlight: GameDetailHighlight;
  readonly isFinished: boolean;
  readonly canChange: boolean;
  readonly tiles: GameDetailTiles;
  readonly winnerCountText: string;
  readonly listedQuestionCountText: string;
  readonly questions: readonly GameQuestionView[];
}
