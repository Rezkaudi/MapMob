import { Observable } from 'rxjs';
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

export abstract class NotificationRepository {
  abstract getNotifications(query: NotificationQuery): Observable<PagedResult<AppNotification>>;
  abstract getSummary(): Observable<NotificationSummary>;
  abstract getNotification(id: string): Observable<NotificationDetail>;
  abstract deleteNotification(id: string): Observable<void>;
  /** Saves a copy as a new draft. */
  abstract duplicateNotification(id: string): Observable<AppNotification>;
  /** `sendAt` is Damascus wall-clock time, `yyyy-mm-ddThh:mm`. */
  abstract rescheduleNotification(id: string, sendAt: string): Observable<AppNotification>;
  /** `null` sends again straight away; a time schedules the resend. */
  abstract resendNotification(id: string, sendAt: string | null): Observable<AppNotification>;
  abstract createNotification(draft: NotificationDraft): Observable<AppNotification>;
  abstract updateNotification(id: string, draft: NotificationDraft): Observable<AppNotification>;
  abstract getFormOptions(): Observable<NotificationFormOptions>;
  abstract searchRecipients(
    audience: NotificationAudience,
    search: string,
  ): Observable<readonly NotificationRecipient[]>;
  abstract estimateAudience(query: AudienceEstimateQuery): Observable<AudienceEstimate>;
}
