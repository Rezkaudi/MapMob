import { CAMPAIGN_STATUS_CHOICES } from './campaign-status-choices';

describe('CAMPAIGN_STATUS_CHOICES', () => {
  it('lists "الكل" and the statuses in the ads panel order, with no draft, with "متوقف" last', () => {
    expect(CAMPAIGN_STATUS_CHOICES).toEqual([
      { value: null, label: 'الكل' },
      { value: 'active', label: 'نشط' },
      { value: 'scheduled', label: 'قادم' },
      { value: 'expired', label: 'منتهي' },
      { value: 'paused', label: 'متوقف' },
    ]);
  });
});
