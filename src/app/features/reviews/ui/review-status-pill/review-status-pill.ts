import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { REVIEW_STATUS_LABEL, ReviewStatus } from '../../models/review-status';

const STATUS_BACKGROUND: Record<ReviewStatus, string> = {
  published: 'bg-status-success',
  reported: 'bg-status-error',
  hidden: 'bg-text-secondary',
};

@Component({
  selector: 'app-review-status-pill',
  templateUrl: './review-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStatusPill {
  readonly status = input.required<ReviewStatus>();

  protected readonly label = computed(() => REVIEW_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
