import { buildNotificationFormGroup } from './notification-form-group';
import { buildNotificationFormErrors } from './notification-form-errors';

const NOW = '2026-09-08T10:00';

describe('buildNotificationFormErrors', () => {
  it('shows nothing before the admin has touched the form', () => {
    expect(buildNotificationFormErrors(buildNotificationFormGroup(() => NOW))).toEqual({
      title: null,
      body: null,
      governorateId: null,
      recipientIds: null,
      sendTime: null,
    });
  });

  it('names every missing piece once save marks the form touched', () => {
    const form = buildNotificationFormGroup(() => NOW);
    form.patchValue({ recipientMode: 'selected', timing: 'later' });
    form.markAllAsTouched();

    expect(buildNotificationFormErrors(form)).toEqual({
      title: 'اكتب عنوان الإشعار',
      body: 'اكتب نص الإشعار التفصيلي',
      governorateId: null,
      recipientIds: 'اختر مستلماً واحداً على الأقل',
      sendTime: 'اختر تاريخ الإرسال وساعته',
    });

    form.patchValue({ recipientMode: 'location', sendDay: '2026-09-01', sendTime: '10:00' });
    expect(buildNotificationFormErrors(form)).toMatchObject({
      governorateId: 'اختر المحافظة',
      recipientIds: null,
      sendTime: 'يجب أن يكون موعد الإرسال بعد الوقت الحالي',
    });
  });
});
