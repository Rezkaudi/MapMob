import { NotificationDraft } from '../models/notification-draft';

/** Multipart, because a draft can carry a picture. */
export function toNotificationFormData(draft: NotificationDraft): FormData {
  const data = new FormData();
  data.set('title', draft.title);
  data.set('body', draft.body);
  data.set('audience', draft.audience);
  data.set('recipientMode', draft.recipientMode);
  data.set('intent', draft.intent);
  data.set('isImageRemoved', String(draft.isImageRemoved));
  draft.recipientIds.forEach((id) => data.append('recipientIds', id));
  for (const [key, value] of Object.entries({
    governorateId: draft.governorateId,
    areaId: draft.areaId,
    sendAt: draft.sendAt,
  })) {
    if (value) {
      data.set(key, value);
    }
  }
  if (draft.image) {
    data.set('image', draft.image);
  }
  return data;
}
