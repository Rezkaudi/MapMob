/** The numbers of the four cards and of the status chips, counted over every story. */
export interface StorySummary {
  readonly storyCount: number;
  readonly activeCount: number;
  readonly hiddenCount: number;
  readonly expiredCount: number;
  /** Views of every story added up. */
  readonly viewCount: number;
}
