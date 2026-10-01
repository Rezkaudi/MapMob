export type DistributionTileTone = 'primary' | 'accent';

/** One grey tile of a "توزيع …" card: a tinted icon, a number and its label. */
export interface DistributionTile {
  readonly key: string;
  readonly label: string;
  readonly count: number;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
  readonly tone: DistributionTileTone;
}
