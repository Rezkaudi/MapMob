export interface ReviewSummary {
  readonly totalCount: number;
  /** The mean of the reviews that carry stars, or 0 when none do. */
  readonly averageRating: number;
  readonly newCount: number;
  readonly reportedCount: number;
}
