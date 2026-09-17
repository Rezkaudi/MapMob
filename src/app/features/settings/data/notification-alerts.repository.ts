import { Observable } from 'rxjs';
import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';

export abstract class NotificationAlertsRepository {
  abstract getAlerts(): Observable<readonly NotificationAlert[]>;
  abstract setAlertEnabled(
    kind: NotificationAlertKind,
    isEnabled: boolean,
  ): Observable<NotificationAlert>;
}
