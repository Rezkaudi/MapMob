import { AppNotification } from '../models/notification';
import { NotificationDetail } from '../models/notification-detail';
import { NotificationDraft } from '../models/notification-draft';
import { NotificationKind } from '../models/notification-kind';
import { LiveNotification } from './live-notification';

/** `yyyy-mm-ddThh:mm`: the server adds seconds and a zone to the time the panel sent. */
const SEND_AT_LENGTH = 16;
const NOT_A_DIGIT = /\D/g;

type LiveIntent = 'publish' | 'schedule' | 'draft';

/** The server sends "n12" as the id but its routes only take the number. */
export function toLiveNotificationId(id: string): string {
  return id.replace(NOT_A_DIGIT, '');
}

function toKind(live: LiveNotification): NotificationKind {
  return live.kind ?? (live.recipientMode === 'all' ? 'general' : 'private');
}

// The server counts 0 people for a list it was given, so the list is counted here.
function toRecipientCount(live: LiveNotification): number {
  return live.recipientMode === 'selected' ? live.recipientIds.length : (live.recipientCount ?? 0);
}

export function toAppNotification(live: LiveNotification): AppNotification {
  return {
    id: live.id,
    title: live.title,
    body: live.body,
    audience: live.audience,
    recipientMode: live.recipientMode,
    kind: toKind(live),
    status: live.status,
    sendAt: live.sendAt?.slice(0, SEND_AT_LENGTH) ?? null,
    recipientCount: toRecipientCount(live),
  };
}

export function toNotificationDetail(live: LiveNotification): NotificationDetail {
  return {
    ...toAppNotification(live),
    imageUrl: live.imageUrl,
    governorateId: live.governorateId,
    areaId: live.areaId,
    recipientIds: live.recipientIds,
  };
}

// "publish" sends at once even with a time; only "schedule" waits for it.
function toLiveIntent(draft: NotificationDraft): LiveIntent {
  if (draft.intent === 'draft') {
    return 'draft';
  }
  return draft.sendAt ? 'schedule' : 'publish';
}

/** Multipart, because a notification can carry a picture. */
export function toLiveNotificationForm(draft: NotificationDraft): FormData {
  const form = new FormData();
  form.set('title[ar]', draft.title);
  form.set('title[en]', draft.title);
  form.set('body[ar]', draft.body);
  form.set('body[en]', draft.body);
  form.set('audience', draft.audience);
  form.set('recipientMode', draft.recipientMode);
  form.set('intent', toLiveIntent(draft));
  form.set('isImageRemoved', draft.isImageRemoved ? '1' : '0');
  if (draft.recipientMode === 'selected') {
    draft.recipientIds.forEach((id, index) => form.set(`recipientIds[${index}]`, id));
  }
  if (draft.recipientMode === 'location' && draft.governorateId) {
    form.set('governorateId', draft.governorateId);
    if (draft.areaId) {
      form.set('areaId', draft.areaId);
    }
  }
  if (draft.sendAt) {
    form.set('sendAt', draft.sendAt);
  }
  if (draft.image) {
    form.set('image', draft.image);
  }
  return form;
}
