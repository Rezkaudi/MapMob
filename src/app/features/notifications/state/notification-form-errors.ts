import { NotificationFormGroup } from './notification-form-group';

export interface NotificationFormErrors {
  readonly title: string | null;
  readonly body: string | null;
  readonly governorateId: string | null;
  readonly recipientIds: string | null;
  readonly sendTime: string | null;
}

const MESSAGES = {
  title: 'اكتب عنوان الإشعار',
  body: 'اكتب نص الإشعار التفصيلي',
  governorateId: 'اختر المحافظة',
  recipientIds: 'اختر مستلماً واحداً على الأقل',
  sendTimeRequired: 'اختر تاريخ الإرسال وساعته',
  sendTimePassed: 'يجب أن يكون موعد الإرسال بعد الوقت الحالي',
};

function textError(form: NotificationFormGroup, field: 'title' | 'body'): string | null {
  const control = form.controls[field];
  return control.touched && control.invalid ? MESSAGES[field] : null;
}

function groupError(
  form: NotificationFormGroup,
  isTouched: boolean,
  code: string,
  message: string,
) {
  return isTouched && form.hasError(code) ? message : null;
}

function sendTimeError(form: NotificationFormGroup): string | null {
  const { timing, sendDay, sendTime } = form.controls;
  const isTouched = timing.touched || sendDay.touched || sendTime.touched;
  return (
    groupError(form, isTouched, 'sendTimeRequired', MESSAGES.sendTimeRequired) ??
    groupError(form, isTouched, 'sendTimePassed', MESSAGES.sendTimePassed)
  );
}

/** The message under each field, shown only once the admin has been there or pressed save. */
export function buildNotificationFormErrors(form: NotificationFormGroup): NotificationFormErrors {
  const { governorateId, recipientIds } = form.controls;
  return {
    title: textError(form, 'title'),
    body: textError(form, 'body'),
    governorateId: groupError(
      form,
      governorateId.touched,
      'governorateRequired',
      MESSAGES.governorateId,
    ),
    recipientIds: groupError(
      form,
      recipientIds.touched,
      'recipientsRequired',
      MESSAGES.recipientIds,
    ),
    sendTime: sendTimeError(form),
  };
}
