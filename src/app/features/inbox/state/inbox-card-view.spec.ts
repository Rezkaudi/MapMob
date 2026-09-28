import { buildInboxNotification } from '../testing/inbox-fixture';
import { toInboxCardView } from './inbox-card-view';

describe('toInboxCardView', () => {
  it('words an admin alert for the card, with no link under it', () => {
    expect(toInboxCardView(buildInboxNotification())).toEqual({
      id: 'inbox-1',
      title: 'بلاغ جديد',
      body: 'تم استلام بلاغ جديد على متجر صيدلية الشفاء ويحتاج إلى المراجعة.',
      categoryLabel: 'البلاغات',
      edgeTone: 'amber',
      receivedAt: '2026-09-20T09:50:00.000Z',
      isRead: false,
      action: null,
    });
  });

  it('keeps the admin frame edges: البلاغات amber, الاشتراكات green', () => {
    const toneOf = (category: 'complaints' | 'subscriptions' | 'offers' | 'system') =>
      toInboxCardView(buildInboxNotification({ category })).edgeTone;

    expect(toneOf('complaints')).toBe('amber');
    expect(toneOf('subscriptions')).toBe('green');
    expect(toneOf('offers')).toBe('primary');
    expect(toneOf('system')).toBe('muted');
  });
});
