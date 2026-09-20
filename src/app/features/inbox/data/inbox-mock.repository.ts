import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InboxNotification } from '../models/inbox-notification';
import { InboxMockDatabaseLoader } from './inbox-mock-database-loader';
import { InboxRepository } from './inbox.repository';

@Injectable()
export class InboxMockRepository implements InboxRepository {
  private readonly loader = inject(InboxMockDatabaseLoader);

  getNotifications(): Observable<readonly InboxNotification[]> {
    return this.loader.request((database) => database.list());
  }

  markAsRead(id: string): Observable<InboxNotification> {
    return this.loader.request((database) => database.markAsRead(id));
  }
}
