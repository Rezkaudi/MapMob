import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';

export class NotificationAlertMockRecords {
  constructor(private alerts: readonly NotificationAlert[]) {}

  list(): readonly NotificationAlert[] {
    return this.alerts;
  }

  setEnabled(kind: NotificationAlertKind, isEnabled: boolean): NotificationAlert {
    const updated = { kind, isEnabled };
    this.alerts = this.alerts.map((alert) => (alert.kind === kind ? updated : alert));
    return updated;
  }
}
