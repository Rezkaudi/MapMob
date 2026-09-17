import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NOTIFICATION_STATUS_LABELS, NotificationStatus } from '../../models/notification-status';

const STATUS_BACKGROUNDS: Record<NotificationStatus, string> = {
  sent: 'bg-status-success',
  scheduled: 'bg-accent',
  draft: 'bg-text-secondary',
};

@Component({
  selector: 'app-notification-status-pill',
  templateUrl: './notification-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationStatusPill {
  readonly status = input.required<NotificationStatus>();

  protected readonly label = computed(() => NOTIFICATION_STATUS_LABELS[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUNDS[this.status()]);
}
