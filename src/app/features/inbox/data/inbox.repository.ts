import { Observable } from 'rxjs';
import { InboxNotification } from '../models/inbox-notification';

export abstract class InboxRepository {
  abstract getNotifications(): Observable<readonly InboxNotification[]>;
  abstract markAsRead(id: string): Observable<InboxNotification>;
}
