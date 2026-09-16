import { NO_AD_FILTERS } from '../models/ad-filters';
import { countActiveAdFilters } from './count-active-ad-filters';

describe('countActiveAdFilters', () => {
  it('counts each group set to something other than "الكل"', () => {
    expect(countActiveAdFilters(NO_AD_FILTERS)).toBe(0);
    expect(
      countActiveAdFilters({
        status: 'active',
        contentType: 'video',
        advertiserType: 'admin',
        placement: 'home',
        runningRange: { from: '2026-08-01', to: null },
      }),
    ).toBe(5);
  });
});
