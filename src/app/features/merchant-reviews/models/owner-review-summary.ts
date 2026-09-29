import { StarCount } from './star-count';

export interface OwnerReviewSummary {
  /** The mean of the reviews that carry stars, or 0 when none do. */
  readonly averageRating: number;
  /** Reviews that carry stars. */
  readonly ratedCount: number;
  /** One entry for each of 5 to 1 stars. */
  readonly starCounts: readonly StarCount[];
  readonly thisMonthCount: number;
  readonly lastMonthCount: number;
}
