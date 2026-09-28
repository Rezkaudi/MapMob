import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { NotificationMockDatabase } from '../../../../mock/notification-mock-database';
import { OwnerNotification } from '../models/owner-notification';
import { OwnerNotificationsRepository } from './owner-notifications.repository';

type OwnerNotificationsMockDatabase = NotificationMockDatabase<OwnerNotification>;

@Injectable()
export class OwnerNotificationsMockRepository implements OwnerNotificationsRepository {
  private database: Promise<OwnerNotificationsMockDatabase> | null = null;

  getNotifications(): Observable<readonly OwnerNotification[]> {
    return this.request((database) => database.list());
  }

  markAsRead(id: string): Observable<OwnerNotification> {
    return this.request((database) => database.markAsRead(id));
  }

  private request<T>(work: (database: OwnerNotificationsMockDatabase) => T): Observable<T> {
    return defer(() => from(this.loadDatabase())).pipe(
      switchMap((database) => mockRequest(() => work(database))),
    );
  }

  // Loaded on first use, so the seed copy stays out of the start-up bundle.
  private loadDatabase(): Promise<OwnerNotificationsMockDatabase> {
    this.database ??= import('./owner-notifications-mock-seed').then(
      ({ buildOwnerNotificationsSeed }) =>
        new NotificationMockDatabase(buildOwnerNotificationsSeed(new Date())),
    );
    return this.database;
  }
}
