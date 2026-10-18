export interface GameOptionView {
  readonly id: string;
  /** أ, ب: the badge in front of the choice. */
  readonly letter: string;
  readonly text: string;
  readonly isLeading: boolean;
  /** 0–100. */
  readonly percent: number;
  readonly percentText: string;
  readonly votesText: string;
}

export interface GameQuestionView {
  readonly id: string;
  readonly number: number;
  readonly ordinalLabel: string;
  readonly text: string;
  readonly voteSecondsText: string;
  readonly hasResults: boolean;
  readonly options: readonly GameOptionView[];
}
