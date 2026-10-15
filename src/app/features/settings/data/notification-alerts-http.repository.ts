import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';
import { NotificationAlertsRepository } from './notification-alerts.repository';

@Injectable()
export class NotificationAlertsHttpRepository implements NotificationAlertsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly alertsUrl = `${inject(API_BASE_URL)}/admin/settings/notifications`;

  getAlerts(): Observable<readonly NotificationAlert[]> {
    return this.httpClient.get<readonly NotificationAlert[]>(this.alertsUrl);
  }

  /** The server answers only that it saved, so the new state is the one sent. */
  setAlertEnabled(kind: NotificationAlertKind, isEnabled: boolean): Observable<NotificationAlert> {
    return this.httpClient
      .put(`${this.alertsUrl}/${kind}`, { isEnabled })
      .pipe(map(() => ({ kind, isEnabled })));
  }
}
