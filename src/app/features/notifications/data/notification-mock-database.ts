import { NotificationDetail } from '../models/notification-detail';
import { NotificationDraft } from '../models/notification-draft';
import { NotificationStatus } from '../models/notification-status';
import { NotificationSummary } from '../models/notification-summary';
import { resolveNotificationKind } from '../state/resolve-notification-kind';

/** In-memory store behind the mock repository, so deletes, copies and new times stick. */
export class NotificationMockDatabase {
  private details: NotificationDetail[];

  private nextNumber: number;

  constructor(seed: readonly NotificationDetail[]) {
    this.details = [...seed];
    this.nextNumber = seed.length + 1;
  }

  list(): readonly NotificationDetail[] {
    return this.details;
  }

  find(id: string): NotificationDetail {
    const detail = this.details.find((candidate) => candidate.id === id);
    if (!detail) {
      throw new Error(`لم يتم العثور على الإشعار ${id}`);
    }
    return detail;
  }

  summarize(): NotificationSummary {
    const countOf = (status: NotificationStatus) =>
      this.details.filter((detail) => detail.status === status).length;
    return {
      totalCount: this.details.length,
      sentCount: countOf('sent'),
      scheduledCount: countOf('scheduled'),
      draftCount: countOf('draft'),
    };
  }

  remove(id: string): void {
    this.details = this.details.filter((detail) => detail.id !== id);
  }

  duplicate(id: string): NotificationDetail {
    const copy: NotificationDetail = {
      ...this.find(id),
      id: `notification-copy-${this.nextNumber++}`,
      status: 'draft',
      sendAt: null,
    };
    this.details = [copy, ...this.details];
    return copy;
  }

  /** `now` is the wall-clock time a notification sent straight away goes out at. */
  create(draft: NotificationDraft, recipientCount: number, now: string): NotificationDetail {
    const detail = buildDetail(
      `notification-new-${this.nextNumber++}`,
      draft,
      recipientCount,
      now,
      null,
    );
    this.details = [detail, ...this.details];
    return detail;
  }

  update(
    id: string,
    draft: NotificationDraft,
    recipientCount: number,
    now: string,
  ): NotificationDetail {
    const keptImageUrl = draft.isImageRemoved ? null : this.find(id).imageUrl;
    const detail = buildDetail(id, draft, recipientCount, now, keptImageUrl);
    this.details = this.details.map((current) => (current.id === id ? detail : current));
    return detail;
  }

  reschedule(id: string, sendAt: string): NotificationDetail {
    return this.patch(id, { sendAt });
  }

  /** `now` is the wall-clock time a resend without a time goes out at. */
  resend(id: string, sendAt: string | null, now: string): NotificationDetail {
    return sendAt
      ? this.patch(id, { status: 'scheduled', sendAt })
      : this.patch(id, { status: 'sent', sendAt: now });
  }

  private patch(id: string, changes: Partial<NotificationDetail>): NotificationDetail {
    const updated = { ...this.find(id), ...changes };
    this.details = this.details.map((detail) => (detail.id === id ? updated : detail));
    return updated;
  }
}

function resolveSavedStatus(draft: NotificationDraft): NotificationStatus {
  if (draft.intent === 'draft') {
    return 'draft';
  }
  return draft.sendAt ? 'scheduled' : 'sent';
}

function buildDetail(
  id: string,
  draft: NotificationDraft,
  recipientCount: number,
  now: string,
  keptImageUrl: string | null,
): NotificationDetail {
  const status = resolveSavedStatus(draft);
  const isByLocation = draft.recipientMode === 'location';
  return {
    id,
    title: draft.title,
    body: draft.body,
    audience: draft.audience,
    recipientMode: draft.recipientMode,
    kind: resolveNotificationKind(draft.recipientMode),
    status,
    sendAt: status === 'sent' ? now : draft.sendAt,
    recipientCount,
    // The mock has nowhere to upload to, so a new picture shows only for this session.
    imageUrl: draft.image ? URL.createObjectURL(draft.image) : keptImageUrl,
    governorateId: isByLocation ? draft.governorateId : null,
    areaId: isByLocation ? draft.areaId : null,
    recipientIds: draft.recipientMode === 'selected' ? draft.recipientIds : [],
  };
}
