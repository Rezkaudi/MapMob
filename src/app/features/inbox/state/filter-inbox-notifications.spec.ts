import { buildInboxNotification } from '../testing/inbox-fixture';
import { filterInboxNotifications } from './filter-inbox-notifications';

const unread = buildInboxNotification({ id: 'a', isRead: false });
const read = buildInboxNotification({ id: 'b', isRead: true });

describe('filterInboxNotifications', () => {
  it('keeps everything on the الكل tab', () => {
    expect(filterInboxNotifications([unread, read], 'all')).toEqual([unread, read]);
  });

  it('keeps only unread ones on the غير مقروءة tab', () => {
    expect(filterInboxNotifications([unread, read], 'unread')).toEqual([unread]);
  });

  it('keeps only read ones on the مقروءة tab', () => {
    expect(filterInboxNotifications([unread, read], 'read')).toEqual([read]);
  });
});
