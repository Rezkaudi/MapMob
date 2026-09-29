const RATING_DECIMALS = 1;

/** "5.0" for five stars; `null` when the review has none. */
export function formatReviewRating(rating: number | null): string | null {
  return rating === null ? null : rating.toFixed(RATING_DECIMALS);
}
