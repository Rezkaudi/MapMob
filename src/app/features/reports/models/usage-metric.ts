/** How often users did one kind of thing, e.g. searched or opened a place. */
export interface UsageMetric {
  readonly label: string;
  readonly count: number;
  /** A percentage from 0 to 100. */
  readonly share: number;
}
