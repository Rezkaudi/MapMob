import { filterNotificationsByTab } from './filter-notifications-by-tab';

const unread = { id: 'a', isRead: false };
const read = { id: 'b', isRead: true };

describe('filterNotificationsByTab', () => {
  it('keeps everything on the الكل tab', () => {
    expect(filterNotificationsByTab([unread, read], 'all')).toEqual([unread, read]);
  });

  it('keeps only unread ones on the غير مقروءة tab', () => {
    expect(filterNotificationsByTab([unread, read], 'unread')).toEqual([unread]);
  });

  it('keeps only read ones on the مقروءة tab', () => {
    expect(filterNotificationsByTab([unread, read], 'read')).toEqual([read]);
  });
});
