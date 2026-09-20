import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { InboxNotification } from '../models/inbox-notification';
import { InboxRepository } from './inbox.repository';

@Injectable()
export class InboxHttpRepository implements InboxRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getNotifications(): Observable<readonly InboxNotification[]> {
    return this.httpClient.get<readonly InboxNotification[]>(`${this.apiBaseUrl}/inbox`);
  }

  markAsRead(id: string): Observable<InboxNotification> {
    return this.httpClient.patch<InboxNotification>(`${this.apiBaseUrl}/inbox/${id}/read`, {});
  }
}
