import { OwnerReviewReportStatus } from './owner-review-report-status';

export interface OwnerReview {
  readonly id: string;
  /** The app user who wrote it. */
  readonly author: { readonly id: string; readonly name: string };
  /** Whole stars from 1 to 5, or `null` for a comment left without stars. */
  readonly rating: number | null;
  readonly comment: string;
  readonly createdAt: string;
  readonly reportStatus: OwnerReviewReportStatus;
}
