import { MerchantReview } from './merchant-review';

/** A review plus its "منذ يومين" label, ready for the card. */
export interface MerchantReviewItem extends MerchantReview {
  readonly ageText: string;
}
