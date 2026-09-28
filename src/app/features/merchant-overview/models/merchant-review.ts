export interface MerchantReview {
  readonly id: string;
  readonly authorName: string;
  /** Whole stars, 1–5. */
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: string;
}
