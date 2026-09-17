import { buildNotificationDraft } from '../testing/notification-fixture';
import { toNotificationFormData } from './notification-form-data';

describe('toNotificationFormData', () => {
  it('writes every field, one entry per picked recipient, and leaves out what is empty', () => {
    const data = toNotificationFormData(
      buildNotificationDraft({
        recipientMode: 'selected',
        recipientIds: ['r1', 'r2'],
        sendAt: '2026-09-20T08:00',
      }),
    );

    expect(data.get('title')).toBe('عروض جديدة بانتظارك');
    expect(data.get('audience')).toBe('users');
    expect(data.get('recipientMode')).toBe('selected');
    expect(data.getAll('recipientIds')).toEqual(['r1', 'r2']);
    expect(data.get('sendAt')).toBe('2026-09-20T08:00');
    expect(data.get('intent')).toBe('publish');
    expect(data.get('isImageRemoved')).toBe('false');
    expect(data.has('governorateId')).toBe(false);
    expect(data.has('image')).toBe(false);
  });
});
