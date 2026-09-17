import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';
import { NotificationAlertsRepository } from './notification-alerts.repository';

@Injectable()
export class NotificationAlertsHttpRepository implements NotificationAlertsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get alertsUrl(): string {
    return `${this.apiBaseUrl}/settings/notifications`;
  }

  getAlerts(): Observable<readonly NotificationAlert[]> {
    return this.httpClient.get<readonly NotificationAlert[]>(this.alertsUrl);
  }

  setAlertEnabled(kind: NotificationAlertKind, isEnabled: boolean): Observable<NotificationAlert> {
    return this.httpClient.put<NotificationAlert>(`${this.alertsUrl}/${kind}`, { isEnabled });
  }
}
