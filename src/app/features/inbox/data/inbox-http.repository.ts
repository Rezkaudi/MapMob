import { LIVE_MAX_PAGE_SIZE } from '../../../core/http/live-max-page-size';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { SKIPS_WRITE_LOCK } from '../../../core/http/skips-write-lock';
import { LiveMetaPage, readAllMetaPages } from '../../../core/http/read-all-meta-pages';
import { InboxNotification } from '../models/inbox-notification';
import { InboxRepository } from './inbox.repository';
import { toInboxNotification } from './live-inbox-mapping';
import { LiveInboxNotification } from './live-inbox-notification';

const READ_IN_BACKGROUND = new HttpContext().set(SKIPS_WRITE_LOCK, true);

const NOT_FOUND_MESSAGE = 'لم يعد هذا الإشعار موجوداً.';

@Injectable()
export class InboxHttpRepository implements InboxRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly inboxUrl = `${inject(API_BASE_URL)}/admin/inbox`;

  getNotifications(): Observable<readonly InboxNotification[]> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<LiveInboxNotification>>(this.inboxUrl, {
        params: { page, per_page: LIVE_MAX_PAGE_SIZE },
      }),
    ).pipe(map((rows) => rows.map(toInboxNotification)));
  }

  markAsRead(id: string): Observable<InboxNotification> {
    return this.httpClient
      .patch<LiveEnvelope<LiveInboxNotification | null>>(
        `${this.inboxUrl}/${id}/read`,
        {},
        { context: READ_IN_BACKGROUND },
      )
      .pipe(switchMap(({ data }) => (data ? of(toInboxNotification(data)) : this.findOne(id))));
  }

  private findOne(id: string): Observable<InboxNotification> {
    return this.getNotifications().pipe(
      map((notifications) => notifications.find((notification) => notification.id === id)),
      switchMap((found) => (found ? of(found) : throwError(() => new Error(NOT_FOUND_MESSAGE)))),
    );
  }
}
