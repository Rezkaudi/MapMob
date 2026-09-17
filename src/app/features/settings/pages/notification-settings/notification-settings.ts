import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { NotificationAlertsStore } from '../../state/notification-alerts.store';
import { NotificationAlertRow } from '../../ui/notification-alert-row/notification-alert-row';
import { SettingsCard } from '../../ui/settings-card/settings-card';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';

const ALERT_PLACEHOLDER_COUNT = 5;

@Component({
  selector: 'app-notification-settings',
  imports: [
    ErrorState,
    NotificationAlertRow,
    SettingsCard,
    SettingsSectionHeading,
    Skeleton,
    Toast,
  ],
  templateUrl: './notification-settings.html',
  providers: [NotificationAlertsStore],
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettings {
  protected readonly store = inject(NotificationAlertsStore);
  protected readonly placeholderRows = Array.from({ length: ALERT_PLACEHOLDER_COUNT });

  constructor() {
    this.store.loadAlerts();
  }
}
