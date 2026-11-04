import { buildNotificationSeed } from './notification-mock-seed';

const NOW = new Date(2026, 8, 8, 9, 0);

describe('buildNotificationSeed', () => {
  it('builds the same list every time', () => {
    expect(buildNotificationSeed(NOW, 12)).toEqual(buildNotificationSeed(NOW, 12));
    expect(buildNotificationSeed(NOW, 12)).toHaveLength(12);
  });

  it('mixes sent and scheduled rows, with no drafts', () => {
    expect(buildNotificationSeed(NOW, 4).map((notification) => notification.status)).toEqual([
      'sent',
      'scheduled',
      'sent',
      'sent',
    ]);
  });

  it('sends in the past and schedules in the future', () => {
    for (const notification of buildNotificationSeed(NOW, 30)) {
      if (notification.status === 'sent') {
        expect(notification.sendAt! < '2026-09-08T09:00').toBe(true);
      }
      if (notification.status === 'scheduled') {
        expect(notification.sendAt! > '2026-09-08T09:00').toBe(true);
      }
    }
  });

  it('keeps the kind in step with how the recipients were picked', () => {
    for (const notification of buildNotificationSeed(NOW, 30)) {
      expect(notification.kind).toBe(notification.recipientMode === 'all' ? 'general' : 'private');
    }
  });
});
