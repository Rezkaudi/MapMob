import { buildNotification } from '../testing/notification-fixture';
import { queryNotifications } from './notification-mock-query';

const SENT = buildNotification({
  id: 'n1',
  title: 'خصومات الصيف',
  status: 'sent',
  sendAt: '2026-08-01T09:00',
});
const SCHEDULED = buildNotification({
  id: 'n2',
  title: 'عروض جديدة',
  audience: 'companies',
  status: 'scheduled',
  sendAt: '2026-09-20T10:00',
});
const DRAFT = buildNotification({
  id: 'n3',
  title: 'مسودة ترحيب',
  recipientMode: 'selected',
  kind: 'private',
  status: 'draft',
  sendAt: null,
});
const NOTIFICATIONS = [SENT, SCHEDULED, DRAFT];
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

describe('queryNotifications', () => {
  it('pages the notifications', () => {
    const page = queryNotifications(NOTIFICATIONS, { pageIndex: 0, pageSize: 2 });

    expect(page.items).toEqual([SENT, SCHEDULED]);
    expect(page.totalCount).toBe(3);
  });

  it('searches the title and the body', () => {
    expect(queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, search: 'الصيف' }).items).toEqual([
      SENT,
    ]);
    expect(
      queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, search: 'اكتشف' }).items,
    ).toHaveLength(3);
  });

  it('filters by audience, kind and status', () => {
    expect(
      queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, audience: 'companies' }).items,
    ).toEqual([SCHEDULED]);
    expect(queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, kind: 'private' }).items).toEqual([
      DRAFT,
    ]);
    expect(queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, status: 'sent' }).items).toEqual([
      SENT,
    ]);
  });

  it('keeps notifications sent inside the day range, and drops drafts with no time', () => {
    const between = (sentFrom?: string, sentTo?: string) =>
      queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, sentFrom, sentTo }).items;

    expect(between('2026-08-01', '2026-08-01')).toEqual([SENT]);
    expect(between('2026-09-01')).toEqual([SCHEDULED]);
    expect(between(undefined, '2026-12-31')).toEqual([SENT, SCHEDULED]);
  });

  it('sorts by send time, drafts with no time last when newest first', () => {
    const idsFor = (sort: 'newest' | 'oldest' | 'name') =>
      queryNotifications(NOTIFICATIONS, { ...FIRST_PAGE, sort }).items.map((item) => item.id);

    expect(idsFor('newest')).toEqual(['n2', 'n1', 'n3']);
    expect(idsFor('oldest')).toEqual(['n3', 'n1', 'n2']);
    expect(idsFor('name')).toEqual(['n1', 'n2', 'n3']);
  });
});
