export interface GameStatCard {
  readonly label: string;
  readonly value: string;
  /** The small grey words the frame writes beside the value. */
  readonly note: string;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
}
