import { NO_MERCHANT_OFFER_FILTERS } from '../models/merchant-offer-filters';
import { countMerchantOfferFilters } from './count-merchant-offer-filters';

describe('countMerchantOfferFilters', () => {
  it('counts each group that narrows the list', () => {
    expect(countMerchantOfferFilters(NO_MERCHANT_OFFER_FILTERS)).toBe(0);
    expect(
      countMerchantOfferFilters({
        ...NO_MERCHANT_OFFER_FILTERS,
        status: 'active',
        scope: 'allItems',
        period: 'today',
      }),
    ).toBe(3);
  });
});
