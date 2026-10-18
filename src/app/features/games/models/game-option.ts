export interface GameOption {
  readonly id: string;
  readonly text: string;
  /** `null` until the game has finished. */
  readonly voteCount: number | null;
}
