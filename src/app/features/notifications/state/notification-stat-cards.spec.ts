import { buildNotificationStatCards } from './notification-stat-cards';

describe('buildNotificationStatCards', () => {
  it('builds the three cards, with no draft card right to left as the design draws them', () => {
    expect(
      buildNotificationStatCards({
        totalCount: 248,
        sentCount: 150,
        scheduledCount: 10,
      }),
    ).toEqual([
      { label: 'إجمالي الإشعارات', value: '248', icon: 'notifications' },
      { label: 'إشعارات تم إرسالها', value: '150', icon: 'notifications' },
      { label: 'إشعارات تم جدولتها', value: '10', icon: 'notifications' },
    ]);
  });

  it('shows zeros before the summary has loaded', () => {
    expect(buildNotificationStatCards(null).map((card) => card.value)).toEqual([
      '0',
      '0',
      '0',
    ]);
  });
});
