export interface UserReview {
  readonly id: string;
  readonly placeName: string;
  readonly categoryName: string;
  readonly locationName: string;
  /** Whole stars, 1 to 5. */
  readonly rating: number;
  readonly comment: string;
  readonly reviewedAt: string;
}
