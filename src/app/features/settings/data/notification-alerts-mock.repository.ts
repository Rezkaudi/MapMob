import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';
import { NotificationAlertsRepository } from './notification-alerts.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class NotificationAlertsMockRepository implements NotificationAlertsRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getAlerts(): Observable<readonly NotificationAlert[]> {
    return this.loader.request((database) => database.notificationAlerts.list());
  }

  setAlertEnabled(kind: NotificationAlertKind, isEnabled: boolean): Observable<NotificationAlert> {
    return this.loader.request((database) =>
      database.notificationAlerts.setEnabled(kind, isEnabled),
    );
  }
}
