import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { OwnerNotification } from '../models/owner-notification';
import { OwnerNotificationsRepository } from './owner-notifications.repository';

@Injectable()
export class OwnerNotificationsHttpRepository implements OwnerNotificationsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get notificationsUrl(): string {
    return `${this.apiBaseUrl}/owner/notifications`;
  }

  getNotifications(): Observable<readonly OwnerNotification[]> {
    return this.httpClient.get<readonly OwnerNotification[]>(this.notificationsUrl);
  }

  markAsRead(id: string): Observable<OwnerNotification> {
    return this.httpClient.patch<OwnerNotification>(`${this.notificationsUrl}/${id}/read`, {});
  }
}
