import { buildOwnerNotificationsSeed } from './owner-notifications-mock-seed';

const NOW = new Date('2026-09-29T10:00:00.000Z');

describe('buildOwnerNotificationsSeed', () => {
  it('holds the three cards of the frame, only the subscription one unread', () => {
    const seed = buildOwnerNotificationsSeed(NOW);
    const recent = seed.filter((notification) => notification.receivedAt >= '2026-09-29');

    expect(recent.map((notification) => [notification.category, notification.isRead])).toEqual([
      ['subscriptions', false],
      ['reviews', true],
      ['reviews', true],
    ]);
    expect(seed.filter((notification) => !notification.isRead)).toHaveLength(1);
  });

  it('dates the frame cards ten minutes back and keeps the two older off-canvas items', () => {
    const seed = buildOwnerNotificationsSeed(NOW);

    expect(seed[0].receivedAt).toBe('2026-09-29T09:50:00.000Z');
    expect(
      seed
        .filter((notification) => notification.receivedAt < '2026-09-29')
        .map((notification) => notification.category),
    ).toEqual(['offers', 'system']);
  });

  it('points the rejected offer notice at an offer', () => {
    const offer = buildOwnerNotificationsSeed(NOW).find(
      (notification) => notification.category === 'offers',
    );

    expect(offer?.subjectId).not.toBeNull();
  });
});
