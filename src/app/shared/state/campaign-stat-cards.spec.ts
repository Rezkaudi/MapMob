import { buildCampaignStatCards } from './campaign-stat-cards';

const LABELS = {
  total: 'إجمالي الإعلانات',
  active: 'الإعلانات النشطة حالياً',
  scheduled: 'إعلانات مجدولة وقادمة',
  ended: 'إعلانات منتهية ومتوقفة',
  totalIcon: 'ads',
};

describe('buildCampaignStatCards', () => {
  it('builds the four cards right to left with the feature words and total icon', () => {
    expect(
      buildCampaignStatCards(
        { totalCount: 1034, activeCount: 16, scheduledCount: 14, endedCount: 23 },
        LABELS,
      ),
    ).toEqual([
      { label: 'إجمالي الإعلانات', value: '1,034', icon: 'ads' },
      { label: 'الإعلانات النشطة حالياً', value: '16', icon: 'check-circle-outline' },
      { label: 'إعلانات مجدولة وقادمة', value: '14', icon: 'time-circle' },
      { label: 'إعلانات منتهية ومتوقفة', value: '23', icon: 'offer-ended' },
    ]);
  });

  it('shows zeros before the summary arrives', () => {
    expect(buildCampaignStatCards(null, LABELS).map((card) => card.value)).toEqual([
      '0',
      '0',
      '0',
      '0',
    ]);
  });
});
