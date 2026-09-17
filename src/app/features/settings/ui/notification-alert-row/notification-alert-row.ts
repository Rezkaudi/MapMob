import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ToggleSwitch } from '../../../../shared/ui/toggle-switch/toggle-switch';
import { NotificationAlert } from '../../models/notification-alert';
import { NOTIFICATION_ALERT_COPY } from './notification-alert-copy';

@Component({
  selector: 'app-notification-alert-row',
  imports: [AppIcon, ToggleSwitch],
  templateUrl: './notification-alert-row.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAlertRow {
  readonly alert = input.required<NotificationAlert>();
  readonly toggled = output<boolean>();

  protected readonly copy = computed(() => NOTIFICATION_ALERT_COPY[this.alert().kind]);
}
