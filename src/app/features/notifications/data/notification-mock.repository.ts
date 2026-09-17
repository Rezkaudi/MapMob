import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
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
import { toWallClockTime } from '../state/wall-clock-time';
import {
  MOCK_AUDIENCE_TOTALS,
  NOTIFICATION_MOCK_GOVERNORATES,
  estimateMockAudience,
} from './notification-mock-audience';
import { NotificationMockDatabase } from './notification-mock-database';
import { searchRecipients } from './notification-mock-recipients';
import { queryNotifications } from './notification-mock-query';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationMockRepository implements NotificationRepository {
  private readonly database = inject(NotificationMockDatabase);
  private readonly clock = inject(CLOCK);

  getNotifications(query: NotificationQuery): Observable<PagedResult<AppNotification>> {
    return mockRequest(() => queryNotifications(this.database.list(), query));
  }

  getSummary(): Observable<NotificationSummary> {
    return mockRequest(() => this.database.summarize());
  }

  getNotification(id: string): Observable<NotificationDetail> {
    return mockRequest(() => this.database.find(id));
  }

  deleteNotification(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  duplicateNotification(id: string): Observable<AppNotification> {
    return mockRequest(() => this.database.duplicate(id));
  }

  rescheduleNotification(id: string, sendAt: string): Observable<AppNotification> {
    return mockRequest(() => this.database.reschedule(id, sendAt));
  }

  resendNotification(id: string, sendAt: string | null): Observable<AppNotification> {
    return mockRequest(() => this.database.resend(id, sendAt, this.now()));
  }

  createNotification(draft: NotificationDraft): Observable<AppNotification> {
    return mockRequest(() => this.database.create(draft, countRecipients(draft), this.now()));
  }

  updateNotification(id: string, draft: NotificationDraft): Observable<AppNotification> {
    return mockRequest(() => this.database.update(id, draft, countRecipients(draft), this.now()));
  }

  getFormOptions(): Observable<NotificationFormOptions> {
    return mockRequest(() => ({ governorates: NOTIFICATION_MOCK_GOVERNORATES }));
  }

  searchRecipients(
    audience: NotificationAudience,
    search: string,
  ): Observable<readonly NotificationRecipient[]> {
    return mockRequest(() => searchRecipients(audience, search));
  }

  estimateAudience(query: AudienceEstimateQuery): Observable<AudienceEstimate> {
    return mockRequest(() => estimateMockAudience(query));
  }

  private now(): string {
    return toWallClockTime(this.clock());
  }
}

function countRecipients(draft: NotificationDraft): number {
  if (draft.recipientMode === 'selected') {
    return draft.recipientIds.length;
  }
  if (draft.recipientMode === 'location' && draft.governorateId) {
    const { audience, governorateId, areaId } = draft;
    return estimateMockAudience({ audience, governorateId, areaId }).deviceCount;
  }
  return MOCK_AUDIENCE_TOTALS[draft.audience];
}
