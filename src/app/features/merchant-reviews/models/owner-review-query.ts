import { ListQuery } from '../../../shared/models/list-query';
import { OwnerReviewReportStatus } from './owner-review-report-status';

export interface OwnerReviewQuery extends ListQuery {
  readonly rating?: number;
  readonly reportStatus?: OwnerReviewReportStatus;
  /** Inclusive calendar days, written `yyyy-mm-dd`. */
  readonly submittedFrom?: string;
  readonly submittedTo?: string;
}
