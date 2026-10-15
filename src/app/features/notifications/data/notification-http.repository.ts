import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveReference } from '../../../core/http/live-reference';
import { PagedResult } from '../../../core/models/paged-result';
import { AppNotification } from '../models/notification';
import { AudienceEstimate, AudienceEstimateQuery } from '../models/audience-estimate';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationDetail } from '../models/notification-detail';
import { NotificationDraft } from '../models/notification-draft';
import { NotificationFormOptions } from '../models/notification-form-options';
import { NotificationRecipient } from '../models/notification-recipient';
import { NotificationQuery } from '../models/notification-query';
import { NotificationSummary } from '../models/notification-summary';
import { LiveNotification } from './live-notification';
import {
  toAppNotification,
  toLiveNotificationForm,
  toLiveNotificationId,
  toNotificationDetail,
} from './live-notification-mapping';
import { queryNotifications } from './notification-list-query';
import { NotificationRepository } from './notification.repository';

const ALL_ROWS_PAGE_SIZE = 1000;

interface LiveRecipient {
  readonly id: string;
  readonly name: string;
  readonly phone: string | null;
  readonly city: string | null;
}

interface LivePlaceRow {
  readonly id: string;
  readonly name: string;
  readonly governorate: LiveReference | null;
}

/** The list ignores every filter and the page size, so it is queried here. */
@Injectable()
export class NotificationHttpRepository implements NotificationRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly notificationsUrl = `${this.adminUrl}/notifications`;

  getNotifications(query: NotificationQuery): Observable<PagedResult<AppNotification>> {
    return this.httpClient
      .get<PagedResult<LiveNotification>>(this.notificationsUrl)
      .pipe(map((page) => queryNotifications(page.items.map(toAppNotification), query)));
  }

  getSummary(): Observable<NotificationSummary> {
    return this.httpClient.get<NotificationSummary>(`${this.notificationsUrl}/summary`);
  }

  getNotification(id: string): Observable<NotificationDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveNotification>>(this.urlOf(id))
      .pipe(map(({ data }) => toNotificationDetail(data)));
  }

  deleteNotification(id: string): Observable<void> {
    return this.httpClient.delete(this.urlOf(id)).pipe(map(() => undefined));
  }

  duplicateNotification(id: string): Observable<AppNotification> {
    return this.httpClient
      .post<LiveEnvelope<LiveNotification>>(`${this.urlOf(id)}/duplicate`, null)
      .pipe(map(({ data }) => toAppNotification(data)));
  }

  /** The answer holds only the new time, so the notification is read again. */
  rescheduleNotification(id: string, sendAt: string): Observable<AppNotification> {
    return this.httpClient
      .post(`${this.urlOf(id)}/reschedule`, { sendAt })
      .pipe(switchMap(() => this.getNotification(id)));
  }

  /** The resend route sends at once whatever time it gets, so a later send schedules a copy. */
  resendNotification(id: string, sendAt: string | null): Observable<AppNotification> {
    if (sendAt) {
      return this.duplicateNotification(id).pipe(
        switchMap((copy) => this.rescheduleNotification(copy.id, sendAt)),
      );
    }
    return this.httpClient
      .post(`${this.urlOf(id)}/resend`, {})
      .pipe(switchMap(() => this.getNotification(id)));
  }

  createNotification(draft: NotificationDraft): Observable<AppNotification> {
    return this.httpClient
      .post<LiveEnvelope<LiveNotification>>(this.notificationsUrl, toLiveNotificationForm(draft))
      .pipe(map(({ data }) => toAppNotification(data)));
  }

  // PHP reads a multipart body only on POST, so the update names its real method inside it.
  updateNotification(id: string, draft: NotificationDraft): Observable<AppNotification> {
    const form = toLiveNotificationForm(draft);
    form.set('_method', 'PUT');
    return this.httpClient
      .post<LiveEnvelope<LiveNotification>>(this.urlOf(id), form)
      .pipe(map(({ data }) => toAppNotification(data)));
  }

  getFormOptions(): Observable<NotificationFormOptions> {
    return this.httpClient.get<NotificationFormOptions>(`${this.notificationsUrl}/formoptions`);
  }

  searchRecipients(
    audience: NotificationAudience,
    search: string,
  ): Observable<readonly NotificationRecipient[]> {
    return audience === 'companies' ? this.searchPlaces(search) : this.searchUsers(search);
  }

  estimateAudience(query: AudienceEstimateQuery): Observable<AudienceEstimate> {
    let params = new HttpParams()
      .set('audience', query.audience)
      .set('governorateId', query.governorateId);
    if (query.areaId) {
      params = params.set('areaId', query.areaId);
    }
    return this.httpClient.get<AudienceEstimate>(`${this.notificationsUrl}/audience-estimate`, {
      params,
    });
  }

  private urlOf(id: string): string {
    return `${this.notificationsUrl}/${toLiveNotificationId(id)}`;
  }

  private searchUsers(search: string): Observable<readonly NotificationRecipient[]> {
    const term = search.trim().toLowerCase();
    return this.httpClient
      .get<readonly LiveRecipient[]>(`${this.notificationsUrl}/recipients`, {
        params: { audience: 'users', search },
      })
      .pipe(
        map((people) =>
          people
            .filter((person) =>
              [person.name, person.phone ?? ''].some((text) => text.toLowerCase().includes(term)),
            )
            .map((person) => ({
              id: person.id,
              name: person.name,
              phone: person.phone ?? '',
              city: person.city ?? '',
            })),
        ),
      );
  }

  private searchPlaces(search: string): Observable<readonly NotificationRecipient[]> {
    return this.httpClient
      .get<PagedResult<LivePlaceRow>>(`${this.adminUrl}/stores`, {
        params: { search, per_page: ALL_ROWS_PAGE_SIZE },
      })
      .pipe(
        map((page) =>
          page.items.map((place) => ({
            id: place.id,
            name: place.name,
            phone: '',
            city: place.governorate?.name ?? '',
          })),
        ),
      );
  }
}
