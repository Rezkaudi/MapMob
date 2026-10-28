import { toInboxNotification } from './live-inbox-mapping';

describe('toInboxNotification', () => {
  it('turns a server row into a card', () => {
    expect(
      toInboxNotification({
        id: 3,
        type: 'complaint',
        title: 'بلاغ جديد',
        body: 'وصل بلاغ',
        read_at: null,
        created_at: '2026-10-28T08:00:00+00:00',
      }),
    ).toEqual({
      id: '3',
      category: 'complaints',
      title: 'بلاغ جديد',
      body: 'وصل بلاغ',
      receivedAt: '2026-10-28T08:00:00+00:00',
      isRead: false,
    });
  });

  it('reads a Laravel notification with its text inside data', () => {
    const card = toInboxNotification({
      id: 'b1f2',
      data: { type: 'subscription_expired', title: 'اشتراك', message: 'انتهى الاشتراك' },
      read_at: '2026-10-28T09:00:00+00:00',
      created_at: '2026-10-28T08:00:00+00:00',
    });
    expect(card.category).toBe('subscriptions');
    expect(card.body).toBe('انتهى الاشتراك');
    expect(card.isRead).toBe(true);
  });

  it('files an unknown kind under system updates', () => {
    const card = toInboxNotification({ id: 1, type: 'other', created_at: '2026-10-28T08:00:00Z' });
    expect(card.category).toBe('system');
    expect(card.title).toBe('');
  });

  it('reads offers and reports, and trusts is_read when sent', () => {
    expect(toInboxNotification({ id: 1, type: 'offer_created', created_at: '' }).category).toBe(
      'offers',
    );
    expect(toInboxNotification({ id: 1, type: 'report', created_at: '' }).category).toBe(
      'complaints',
    );
    expect(toInboxNotification({ id: 1, is_read: true, created_at: '' }).isRead).toBe(true);
  });
});
