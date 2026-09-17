import { toNotificationDraft } from './notification-draft-mapping';

const BASE_VALUE = {
  title: '  عروض جديدة  ',
  body: ' اكتشف العروض ',
  audience: 'users' as const,
  recipientMode: 'location' as const,
  governorateId: 'governorate-1',
  areaId: null,
  recipientIds: ['recipient-1'],
  timing: 'later' as const,
  sendDay: '2026-09-20',
  sendTime: '08:00',
};

describe('toNotificationDraft', () => {
  it('trims the text, joins the send time and keeps only what the recipient mode reads', () => {
    expect(
      toNotificationDraft(BASE_VALUE, { image: null, hadSavedImage: false, intent: 'publish' }),
    ).toEqual({
      title: 'عروض جديدة',
      body: 'اكتشف العروض',
      audience: 'users',
      recipientMode: 'location',
      governorateId: 'governorate-1',
      areaId: null,
      recipientIds: [],
      sendAt: '2026-09-20T08:00',
      intent: 'publish',
      image: null,
      isImageRemoved: false,
    });
  });

  it('sends straight away, drops the place for picked recipients and notes a removed picture', () => {
    const draft = toNotificationDraft(
      { ...BASE_VALUE, recipientMode: 'selected', timing: 'now' },
      { image: null, hadSavedImage: true, intent: 'draft' },
    );

    expect(draft).toMatchObject({
      governorateId: null,
      recipientIds: ['recipient-1'],
      sendAt: null,
      intent: 'draft',
      isImageRemoved: true,
    });
  });
});
