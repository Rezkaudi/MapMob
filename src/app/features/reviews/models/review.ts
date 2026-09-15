import { ReviewStatus } from './review-status';

export interface Review {
  readonly id: string;
  readonly userName: string;
  readonly placeName: string;
  /** Whole stars from 1 to 5, or `null` for a comment left without stars. */
  readonly rating: number | null;
  readonly comment: string;
  readonly createdAt: string;
  readonly status: ReviewStatus;
}
