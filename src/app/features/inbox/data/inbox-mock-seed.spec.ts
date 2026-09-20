import { buildInboxSeed } from './inbox-mock-seed';

const NOW = new Date('2026-09-20T10:00:00.000Z');

describe('buildInboxSeed', () => {
  it('opens with the two notifications the design draws, newest first', () => {
    const [first, second] = buildInboxSeed(NOW);

    expect([first.title, first.category, first.isRead]).toEqual(['بلاغ جديد', 'complaints', false]);
    expect([second.title, second.category, second.isRead]).toEqual([
      'طلب ترقية باقة',
      'subscriptions',
      true,
    ]);
  });

  it('dates the first two ten minutes back, so they read "منذ 10 دقائق"', () => {
    const [first, second] = buildInboxSeed(NOW);

    expect(first.receivedAt).toBe('2026-09-20T09:50:00.000Z');
    expect(second.receivedAt).toBe('2026-09-20T09:50:00.000Z');
  });

  it('leaves exactly one notification unread', () => {
    expect(buildInboxSeed(NOW).filter((notification) => !notification.isRead).length).toBe(1);
  });

  it('gives every notification its own id', () => {
    const seed = buildInboxSeed(NOW);

    expect(new Set(seed.map((notification) => notification.id)).size).toBe(seed.length);
  });
});
