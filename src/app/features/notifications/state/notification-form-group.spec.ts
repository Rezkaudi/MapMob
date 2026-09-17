import { buildNotificationDetail } from '../testing/notification-fixture';
import {
  NOTIFICATION_BODY_MAX_LENGTH,
  NOTIFICATION_TITLE_MAX_LENGTH,
  buildNotificationFormGroup,
  toNotificationFormValue,
} from './notification-form-group';

const NOW = '2026-09-08T10:00';

function validForm() {
  const form = buildNotificationFormGroup(() => NOW);
  form.patchValue({ title: 'عروض جديدة بانتظارك', body: 'اكتشف أحدث العروض.' });
  return form;
}

describe('buildNotificationFormGroup', () => {
  it('starts on users, every user and a send straight away', () => {
    const value = buildNotificationFormGroup(() => NOW).getRawValue();

    expect(value).toMatchObject({
      title: '',
      body: '',
      audience: 'users',
      recipientMode: 'all',
      recipientIds: [],
      timing: 'now',
      sendDay: null,
      sendTime: null,
    });
    expect(NOTIFICATION_TITLE_MAX_LENGTH).toBe(60);
    expect(NOTIFICATION_BODY_MAX_LENGTH).toBe(120);
  });

  it('needs a title and a body with text, within their lengths', () => {
    const form = validForm();
    expect(form.valid).toBe(true);

    form.controls.title.setValue('   ');
    expect(form.controls.title.valid).toBe(false);
    form.controls.title.setValue('ع'.repeat(61));
    expect(form.controls.title.valid).toBe(false);
    form.controls.body.setValue('ن'.repeat(121));
    expect(form.controls.body.valid).toBe(false);
  });

  it('needs at least one picked recipient, or a governorate when picking by place', () => {
    const form = validForm();

    form.controls.recipientMode.setValue('selected');
    expect(form.hasError('recipientsRequired')).toBe(true);
    form.controls.recipientIds.setValue(['recipient-1']);
    expect(form.valid).toBe(true);

    form.controls.recipientMode.setValue('location');
    expect(form.hasError('governorateRequired')).toBe(true);
    form.controls.governorateId.setValue('governorate-1');
    expect(form.valid).toBe(true);
  });

  it('needs a later send to have a day and a time still ahead of now', () => {
    const form = validForm();

    form.controls.timing.setValue('later');
    expect(form.hasError('sendTimeRequired')).toBe(true);
    form.patchValue({ sendDay: '2026-09-08', sendTime: '09:00' });
    expect(form.hasError('sendTimePassed')).toBe(true);
    form.patchValue({ sendTime: '11:30' });
    expect(form.valid).toBe(true);
  });
});

describe('toNotificationFormValue', () => {
  it('fills the form from a scheduled notification picked by place', () => {
    expect(
      toNotificationFormValue(
        buildNotificationDetail({
          recipientMode: 'location',
          governorateId: 'governorate-1',
          areaId: 'governorate-1-area-2',
          sendAt: '2026-09-10T10:00',
        }),
      ),
    ).toEqual({
      title: 'عروض جديدة بالقرب منك',
      body: 'اكتشف أحدث العروض والخصومات المتوفرة بالقرب منك.',
      audience: 'users',
      recipientMode: 'location',
      governorateId: 'governorate-1',
      areaId: 'governorate-1-area-2',
      recipientIds: [],
      timing: 'later',
      sendDay: '2026-09-10',
      sendTime: '10:00',
    });
  });

  it('opens a sent notification on a send straight away', () => {
    const value = toNotificationFormValue(
      buildNotificationDetail({ status: 'sent', sendAt: '2026-09-01T10:00' }),
    );

    expect(value).toMatchObject({ timing: 'now', sendDay: null, sendTime: null });
  });
});
