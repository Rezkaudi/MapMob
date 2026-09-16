import { buildAdStatCards } from './ad-stat-cards';

describe('buildAdStatCards', () => {
  it('words the four cards for ads, with the megaphone on the total', () => {
    expect(
      buildAdStatCards({ totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 23 }).map(
        ({ label, icon }) => [label, icon],
      ),
    ).toEqual([
      ['إجمالي الإعلانات', 'ads'],
      ['الإعلانات النشطة حالياً', 'check-circle-outline'],
      ['إعلانات مجدولة وقادمة', 'time-circle'],
      ['إعلانات منتهية ومتوقفة', 'offer-ended'],
    ]);
  });
});
