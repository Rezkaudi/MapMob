import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { OwnerNotification } from '../models/owner-notification';
import { LiveOwnerNotification } from './live-owner-notification';
import { OwnerNotificationsRepository } from './owner-notifications.repository';
import { toOwnerNotification } from './to-owner-notification';

@Injectable()
export class OwnerNotificationsHttpRepository implements OwnerNotificationsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly notificationsUrl = `${inject(API_BASE_URL)}/owner/notifications`;

  getNotifications(): Observable<readonly OwnerNotification[]> {
    return readAllOwnerPages<LiveOwnerNotification>(this.httpClient, this.notificationsUrl).pipe(
      map((rows) => rows.map(toOwnerNotification)),
    );
  }

  markAsRead(id: string): Observable<OwnerNotification> {
    return this.httpClient
      .patch<LiveEnvelope<LiveOwnerNotification>>(`${this.notificationsUrl}/${id}/read`, {})
      .pipe(map(({ data }) => toOwnerNotification(data)));
  }
}
