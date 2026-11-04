import { buildNotificationDetail, buildNotificationDraft } from '../testing/notification-fixture';
import { NotificationMockDatabase } from './notification-mock-database';

const SENT = buildNotificationDetail({ id: 'n1', status: 'sent', sendAt: '2026-09-01T10:00' });
const SCHEDULED = buildNotificationDetail({ id: 'n2', status: 'scheduled' });
const SENT_AT_ONCE = buildNotificationDetail({ id: 'n3', status: 'sent', sendAt: null });
const NOW = '2026-09-08T09:15';

function createDatabase(): NotificationMockDatabase {
  return new NotificationMockDatabase([SENT, SCHEDULED, SENT_AT_ONCE]);
}

describe('NotificationMockDatabase', () => {
  it('lists, finds and summarizes the notifications', () => {
    const database = createDatabase();

    expect(database.list()).toEqual([SENT, SCHEDULED, SENT_AT_ONCE]);
    expect(database.find('n2')).toEqual(SCHEDULED);
    expect(database.summarize()).toEqual({
      totalCount: 3,
      sentCount: 2,
      scheduledCount: 1,
    });
  });

  it('fails to find a notification that does not exist', () => {
    expect(() => createDatabase().find('missing')).toThrowError();
  });

  it('deletes a notification', () => {
    const database = createDatabase();

    database.remove('n1');

    expect(database.list().map((notification) => notification.id)).toEqual(['n2', 'n3']);
  });

  it('moves a scheduled notification to a new time', () => {
    const database = createDatabase();

    expect(database.reschedule('n2', '2026-09-18T16:30')).toEqual({
      ...SCHEDULED,
      sendAt: '2026-09-18T16:30',
    });
  });

  it('resends now, or schedules the resend for later', () => {
    const database = createDatabase();

    expect(database.resend('n1', null, NOW)).toMatchObject({ status: 'sent', sendAt: NOW });
    expect(database.resend('n1', '2026-09-20T08:00', NOW)).toMatchObject({
      status: 'scheduled',
      sendAt: '2026-09-20T08:00',
    });
  });

  it('creates a notification at the top: sent now or scheduled for later', () => {
    const database = createDatabase();

    const sent = database.create(buildNotificationDraft(), 1250, NOW);
    const scheduled = database.create(
      buildNotificationDraft({
        sendAt: '2026-09-20T08:00',
        recipientMode: 'location',
        governorateId: 'g1',
      }),
      300,
      NOW,
    );

    expect(sent).toMatchObject({
      status: 'sent',
      sendAt: NOW,
      kind: 'general',
      recipientCount: 1250,
    });
    expect(scheduled).toMatchObject({ status: 'scheduled', kind: 'private', governorateId: 'g1' });
    expect(database.list()[0]).toEqual(scheduled);
  });

  it('keeps only the recipients the mode reads, and keeps or drops the saved picture', () => {
    const database = new NotificationMockDatabase([
      buildNotificationDetail({ id: 'n1', imageUrl: 'saved.png' }),
    ]);

    const kept = database.update(
      'n1',
      buildNotificationDraft({ recipientMode: 'all', recipientIds: ['r1'], governorateId: 'g1' }),
      10,
      NOW,
    );
    expect(kept).toMatchObject({
      id: 'n1',
      recipientIds: [],
      governorateId: null,
      imageUrl: 'saved.png',
    });

    const removed = database.update(
      'n1',
      buildNotificationDraft({ isImageRemoved: true }),
      10,
      NOW,
    );
    expect(removed.imageUrl).toBeNull();
  });
});
