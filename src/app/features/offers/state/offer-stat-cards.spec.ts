import { buildOfferStatCards } from './offer-stat-cards';

describe('buildOfferStatCards', () => {
  it('builds the four cards right to left, as the design does', () => {
    expect(
      buildOfferStatCards({
        totalCount: 1034,
        activeCount: 16,
        scheduledCount: 14,
        endedCount: 23,
      }),
    ).toEqual([
      { label: 'إجمالي العروض', value: '1,034', icon: 'offers' },
      { label: 'العروض النشطة حالياً', value: '16', icon: 'check-circle-outline' },
      { label: 'عروض مجدولة وقادمة', value: '14', icon: 'time-circle' },
      { label: 'عروض منتهية ومتوقفة', value: '23', icon: 'offer-ended' },
    ]);
  });

  it('shows zeros before the summary arrives', () => {
    expect(buildOfferStatCards(null).map((card) => card.value)).toEqual(['0', '0', '0', '0']);
  });
});
