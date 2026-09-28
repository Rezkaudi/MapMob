import { Observable } from 'rxjs';
import { NotificationFeedSource } from '../../../shared/state/with-notification-feed';
import { OwnerNotification } from '../models/owner-notification';

export abstract class OwnerNotificationsRepository implements NotificationFeedSource<OwnerNotification> {
  abstract getNotifications(): Observable<readonly OwnerNotification[]>;
  abstract markAsRead(id: string): Observable<OwnerNotification>;
}
