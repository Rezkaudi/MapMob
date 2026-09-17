import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
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
import { toNotificationFormData } from './notification-form-data';
import { toNotificationQueryParams } from './notification-query-params';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationHttpRepository implements NotificationRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get notificationsUrl(): string {
    return `${this.apiBaseUrl}/notifications`;
  }

  getNotifications(query: NotificationQuery): Observable<PagedResult<AppNotification>> {
    return this.httpClient.get<PagedResult<AppNotification>>(this.notificationsUrl, {
      params: toNotificationQueryParams(query),
    });
  }

  getSummary(): Observable<NotificationSummary> {
    return this.httpClient.get<NotificationSummary>(`${this.notificationsUrl}/summary`);
  }

  getNotification(id: string): Observable<NotificationDetail> {
    return this.httpClient.get<NotificationDetail>(`${this.notificationsUrl}/${id}`);
  }

  deleteNotification(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.notificationsUrl}/${id}`);
  }

  duplicateNotification(id: string): Observable<AppNotification> {
    return this.httpClient.post<AppNotification>(`${this.notificationsUrl}/${id}/duplicate`, null);
  }

  rescheduleNotification(id: string, sendAt: string): Observable<AppNotification> {
    return this.httpClient.post<AppNotification>(`${this.notificationsUrl}/${id}/reschedule`, {
      sendAt,
    });
  }

  resendNotification(id: string, sendAt: string | null): Observable<AppNotification> {
    return this.httpClient.post<AppNotification>(`${this.notificationsUrl}/${id}/resend`, {
      sendAt,
    });
  }

  createNotification(draft: NotificationDraft): Observable<AppNotification> {
    return this.httpClient.post<AppNotification>(
      this.notificationsUrl,
      toNotificationFormData(draft),
    );
  }

  updateNotification(id: string, draft: NotificationDraft): Observable<AppNotification> {
    return this.httpClient.put<AppNotification>(
      `${this.notificationsUrl}/${id}`,
      toNotificationFormData(draft),
    );
  }

  getFormOptions(): Observable<NotificationFormOptions> {
    return this.httpClient.get<NotificationFormOptions>(`${this.notificationsUrl}/form-options`);
  }

  searchRecipients(
    audience: NotificationAudience,
    search: string,
  ): Observable<readonly NotificationRecipient[]> {
    return this.httpClient.get<readonly NotificationRecipient[]>(
      `${this.notificationsUrl}/recipients`,
      {
        params: new HttpParams().set('audience', audience).set('search', search),
      },
    );
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
}
