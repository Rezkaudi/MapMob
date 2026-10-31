/** GET /owner/reviews/summary */
export interface LiveOwnerReviewSummary {
  readonly trustedReviewCount: number;
  readonly averageRating: number;
  /** Five rows; with no `stars` field they are read as 5 stars down to 1. */
  readonly starDistribution: readonly { readonly stars?: number; readonly count: number }[];
  readonly monthly: {
    readonly newReviews: number;
    readonly previousComparablePeriodReviews: number;
  };
}
