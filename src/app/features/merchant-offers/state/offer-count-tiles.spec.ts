import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { countOffers } from './offer-count-tiles';

describe('countOffers', () => {
  it('counts every offer, then the running and the expired ones, total first', () => {
    const offers = [
      buildMerchantOffer({ id: '1', status: 'active' }),
      buildMerchantOffer({ id: '2', status: 'expired' }),
      buildMerchantOffer({ id: '3', status: 'active' }),
      buildMerchantOffer({ id: '4', status: 'paused' }),
    ];

    expect(countOffers(offers)).toEqual([
      { label: 'إجمالي العروض منذ الانضمام', count: 4 },
      { label: 'العروض النشطة', count: 2 },
      { label: 'العروض المنتهية', count: 1 },
    ]);
  });
});
