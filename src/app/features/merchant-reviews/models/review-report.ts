import { ReviewReportReason } from './review-report-reason';

/** What "إرسال البلاغ" sends. */
export interface ReviewReport {
  readonly reason: ReviewReportReason;
  readonly notes: string | null;
}
