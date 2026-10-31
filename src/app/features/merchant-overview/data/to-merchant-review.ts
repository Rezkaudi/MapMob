import { MerchantReview } from '../models/merchant-review';
import { LiveOwnerReview } from '../../../shared/data/live-owner-review';

export function toMerchantReview(review: LiveOwnerReview): MerchantReview {
  return {
    id: String(review.id),
    authorName:
      review.authorName ?? review.userName ?? review.user?.name ?? review.author?.name ?? '',
    rating: review.rating ?? 0,
    comment: review.comment ?? '',
    createdAt: review.createdAt ?? review.created_at ?? '',
  };
}
