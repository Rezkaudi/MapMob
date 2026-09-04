import { ReviewStatus } from './review-status';

export interface Review {
  readonly id: string;
  readonly userName: string;
  readonly userAvatarUrl: string | null;
  readonly placeName: string;
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: string;
  readonly status: ReviewStatus;
}
