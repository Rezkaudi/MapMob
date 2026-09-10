import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  NOTIFICATION_PRIORITY_DOT,
  NOTIFICATION_PRIORITY_LABEL,
  NotificationPriority,
} from '../../notification-priority';

/** Right to left, the design orders the choices: general, important, urgent. */
const PRIORITIES: readonly NotificationPriority[] = ['general', 'important', 'urgent'];

@Component({
  selector: 'app-priority-picker',
  templateUrl: './priority-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityPicker {
  readonly selected = input.required<NotificationPriority>();
  readonly selectedChange = output<NotificationPriority>();

  protected readonly priorities = PRIORITIES;
  protected readonly priorityLabel = NOTIFICATION_PRIORITY_LABEL;
  protected readonly priorityDot = NOTIFICATION_PRIORITY_DOT;
}
