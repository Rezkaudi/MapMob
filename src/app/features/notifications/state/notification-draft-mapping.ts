import { UploadedImage } from '../../../shared/ui/image-upload-field/uploaded-image';
import { NotificationDraft, NotificationSaveIntent } from '../models/notification-draft';
import { NotificationFormValue } from './notification-form-group';
import { joinSendAt } from './send-moment';

export interface NotificationDraftExtras {
  readonly image: UploadedImage | null;
  /** Whether the notification had a picture when the form opened. */
  readonly hadSavedImage: boolean;
  readonly intent: NotificationSaveIntent;
}

function readSendAt(value: NotificationFormValue): string | null {
  const { timing, sendDay, sendTime } = value;
  return timing === 'later' && sendDay && sendTime
    ? joinSendAt({ day: sendDay, time: sendTime })
    : null;
}

export function toNotificationDraft(
  value: NotificationFormValue,
  extras: NotificationDraftExtras,
): NotificationDraft {
  const isByLocation = value.recipientMode === 'location';
  return {
    title: value.title.trim(),
    body: value.body.trim(),
    audience: value.audience,
    recipientMode: value.recipientMode,
    governorateId: isByLocation ? value.governorateId : null,
    areaId: isByLocation ? value.areaId : null,
    recipientIds: value.recipientMode === 'selected' ? value.recipientIds : [],
    sendAt: readSendAt(value),
    intent: extras.intent,
    image: extras.image?.file ?? null,
    isImageRemoved: extras.hadSavedImage && extras.image === null,
  };
}
