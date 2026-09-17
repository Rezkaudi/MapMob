import { buildNotification } from '../testing/notification-fixture';
import { buildNotificationRow } from './notification-row';

describe('buildNotificationRow', () => {
  it('spells out the audience, the kind, the recipients and the send day', () => {
    const notification = buildNotification({ sendAt: '2026-09-10T00:30' });

    expect(buildNotificationRow(notification)).toEqual({
      notification,
      audienceLabel: 'المستخدمون',
      kindLabel: 'عام',
      recipientLabel: 'جميع المستخدمين',
      sendDay: '2026-09-10',
    });
  });

  it('names company recipients and leaves the day empty for a draft with no time', () => {
    const row = buildNotificationRow(
      buildNotification({
        audience: 'companies',
        recipientMode: 'selected',
        kind: 'private',
        status: 'draft',
        sendAt: null,
      }),
    );

    expect(row.audienceLabel).toBe('الشركات والمتاجر');
    expect(row.kindLabel).toBe('خاص');
    expect(row.recipientLabel).toBe('شركات ومتاجر محددة');
    expect(row.sendDay).toBeNull();
  });
});
