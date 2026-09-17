import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationDetail } from '../models/notification-detail';
import { RecipientMode } from '../models/recipient-mode';
import { SendTiming } from '../models/send-timing';
import {
  recipientsValidator,
  sendTimeValidator,
  WallClockNow,
} from './notification-form-validators';
import { splitSendAt } from './send-moment';

export const NOTIFICATION_TITLE_MAX_LENGTH = 60;
export const NOTIFICATION_BODY_MAX_LENGTH = 120;

const HAS_TEXT = /\S/;

function textControl(maxLength: number) {
  return new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(HAS_TEXT),
      Validators.maxLength(maxLength),
    ],
  });
}

function valueControl<T>(value: T, validators: ValidatorFn[] = []) {
  return new FormControl<T>(value, { nonNullable: true, validators });
}

export function buildNotificationFormGroup(now: WallClockNow) {
  return new FormGroup(
    {
      title: textControl(NOTIFICATION_TITLE_MAX_LENGTH),
      body: textControl(NOTIFICATION_BODY_MAX_LENGTH),
      audience: valueControl<NotificationAudience>('users'),
      recipientMode: valueControl<RecipientMode>('all'),
      governorateId: new FormControl<string | null>(null),
      areaId: new FormControl<string | null>(null),
      recipientIds: valueControl<readonly string[]>([]),
      timing: valueControl<SendTiming>('now'),
      sendDay: new FormControl<string | null>(null),
      sendTime: new FormControl<string | null>(null),
    },
    { validators: [recipientsValidator, sendTimeValidator(now)] },
  );
}

export type NotificationFormGroup = ReturnType<typeof buildNotificationFormGroup>;
export type NotificationFormValue = ReturnType<NotificationFormGroup['getRawValue']>;

/** A sent notification has no time left to keep, so its form opens on a send straight away. */
export function toNotificationFormValue(detail: NotificationDetail): NotificationFormValue {
  const keptSendAt = detail.status === 'sent' ? null : detail.sendAt;
  const moment = keptSendAt ? splitSendAt(keptSendAt) : null;
  return {
    title: detail.title,
    body: detail.body,
    audience: detail.audience,
    recipientMode: detail.recipientMode,
    governorateId: detail.governorateId,
    areaId: detail.areaId,
    recipientIds: detail.recipientIds,
    timing: moment ? 'later' : 'now',
    sendDay: moment?.day ?? null,
    sendTime: moment?.time ?? null,
  };
}
