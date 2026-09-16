import { NO_OFFER_FILTERS } from '../models/offer-filters';
import { countActiveOfferFilters } from './count-active-offer-filters';

describe('countActiveOfferFilters', () => {
  it('counts nothing for "الكل" and an open range', () => {
    expect(countActiveOfferFilters(NO_OFFER_FILTERS)).toBe(0);
  });

  it('counts the status and a range with either end set', () => {
    expect(
      countActiveOfferFilters({ status: 'paused', runningRange: { from: null, to: '2026-09-02' } }),
    ).toBe(2);
  });
});
