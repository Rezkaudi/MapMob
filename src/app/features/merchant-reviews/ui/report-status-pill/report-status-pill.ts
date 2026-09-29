import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  OWNER_REVIEW_REPORT_STATUS_LABEL,
  OwnerReviewReportStatus,
} from '../../models/owner-review-report-status';

const STATUS_BACKGROUND: Record<OwnerReviewReportStatus, string> = {
  none: 'bg-status-success',
  pending: 'bg-accent',
  accepted: 'bg-text-secondary',
  rejected: 'bg-closed',
};

/** The white-on-colour "حالة البلاغ" pill of the reviews table. */
@Component({
  selector: 'app-report-status-pill',
  templateUrl: './report-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportStatusPill {
  readonly status = input.required<OwnerReviewReportStatus>();

  protected readonly label = computed(() => OWNER_REVIEW_REPORT_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
