import { NotificationDraft } from '../models/notification-draft';
import { LiveNotification } from './live-notification';
import {
  toAppNotification,
  toLiveNotificationForm,
  toLiveNotificationId,
  toNotificationDetail,
} from './live-notification-mapping';

const LIVE: LiveNotification = {
  id: 'n5',
  title: 'تحديث جديد',
  body: 'نسخة جديدة',
  audience: 'users',
  recipientMode: 'selected',
  kind: null,
  status: 'scheduled',
  sendAt: '2030-01-01T10:00:00+00:00',
  sentAt: null,
  recipientCount: null,
  imageUrl: null,
  governorateId: null,
  areaId: null,
  recipientIds: ['1', '5'],
};

const DRAFT: NotificationDraft = {
  title: 'تحديث جديد',
  body: 'نسخة جديدة',
  audience: 'users',
  recipientMode: 'selected',
  governorateId: null,
  areaId: null,
  recipientIds: ['1', '5'],
  sendAt: null,
  intent: 'publish',
  image: null,
  isImageRemoved: false,
};

describe('live notification mapping', () => {
  it('keeps the minutes of the saved time and works out what the server leaves out', () => {
    expect(toAppNotification(LIVE)).toEqual({
      id: 'n5',
      title: 'تحديث جديد',
      body: 'نسخة جديدة',
      audience: 'users',
      recipientMode: 'selected',
      kind: 'private',
      status: 'scheduled',
      sendAt: '2030-01-01T10:00',
      recipientCount: 2,
    });
  });

  it('calls a notification to everyone general', () => {
    expect(toAppNotification({ ...LIVE, recipientMode: 'all', recipientCount: 40 }).kind).toBe(
      'general',
    );
  });

  it('keeps the place and the picked people for the edit form', () => {
    const detail = toNotificationDetail({ ...LIVE, governorateId: '1', areaId: '7' });

    expect([detail.governorateId, detail.areaId, detail.recipientIds]).toEqual([
      '1',
      '7',
      ['1', '5'],
    ]);
  });

  it('turns the id the server shows into the number its routes take', () => {
    expect(toLiveNotificationId('n12')).toBe('12');
  });

  it('sends both languages, the people picked and send-now as publish', () => {
    const form = toLiveNotificationForm(DRAFT);

    expect([form.get('title[ar]'), form.get('title[en]')]).toEqual(['تحديث جديد', 'تحديث جديد']);
    expect([form.get('recipientIds[0]'), form.get('recipientIds[1]')]).toEqual(['1', '5']);
    expect(form.get('intent')).toBe('publish');
    expect(form.get('isImageRemoved')).toBe('0');
    expect(form.has('sendAt')).toBe(false);
  });

  it('asks the server to schedule a send with a time', () => {
    const form = toLiveNotificationForm({ ...DRAFT, sendAt: '2030-01-01T10:00' });

    expect(form.get('intent')).toBe('schedule');
    expect(form.get('sendAt')).toBe('2030-01-01T10:00');
  });

  it('keeps a draft a draft', () => {
    expect(toLiveNotificationForm({ ...DRAFT, intent: 'draft' }).get('intent')).toBe('draft');
  });

  it('sends the place only when the people are picked by place', () => {
    const form = toLiveNotificationForm({
      ...DRAFT,
      recipientMode: 'location',
      recipientIds: [],
      governorateId: '1',
      areaId: null,
    });

    expect(form.get('governorateId')).toBe('1');
    expect(form.has('areaId')).toBe(false);
    expect(form.has('recipientIds[0]')).toBe(false);
  });
});
