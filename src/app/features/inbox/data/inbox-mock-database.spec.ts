import { buildInboxNotification } from '../testing/inbox-fixture';
import { InboxMockDatabase } from './inbox-mock-database';

function database(): InboxMockDatabase {
  return new InboxMockDatabase([
    buildInboxNotification({ id: 'a', receivedAt: '2026-09-20T08:00:00.000Z' }),
    buildInboxNotification({ id: 'b', receivedAt: '2026-09-20T09:00:00.000Z', isRead: true }),
  ]);
}

describe('InboxMockDatabase', () => {
  it('lists the newest notification first', () => {
    expect(
      database()
        .list()
        .map((notification) => notification.id),
    ).toEqual(['b', 'a']);
  });

  it('marks one as read and keeps it that way', () => {
    const store = database();

    expect(store.markAsRead('a').isRead).toBe(true);
    expect(store.list().find((notification) => notification.id === 'a')?.isRead).toBe(true);
  });

  it('refuses an id it does not hold', () => {
    expect(() => database().markAsRead('missing')).toThrowError(/missing/);
  });
});
