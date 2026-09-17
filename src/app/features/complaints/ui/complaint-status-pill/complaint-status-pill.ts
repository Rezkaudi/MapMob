import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { COMPLAINT_STATUS_LABELS, ComplaintStatus } from '../../models/complaint-status';

const STATUS_BACKGROUNDS: Record<ComplaintStatus, string> = {
  new: 'bg-primary',
  inReview: 'bg-accent',
  resolved: 'bg-status-success',
  rejected: 'bg-closed',
};

@Component({
  selector: 'app-complaint-status-pill',
  templateUrl: './complaint-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintStatusPill {
  readonly status = input.required<ComplaintStatus>();

  protected readonly label = computed(() => COMPLAINT_STATUS_LABELS[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUNDS[this.status()]);
}
