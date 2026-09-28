import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { toMerchantOfferRow } from './merchant-offer-rows';

describe('toMerchantOfferRow', () => {
  it('prints the scope, both days and the first letter for the tile', () => {
    const offer = buildMerchantOffer({ startsOn: '2024-01-12', endsOn: '2024-01-26' });

    expect(toMerchantOfferRow(offer)).toEqual({
      offer,
      initial: 'خ',
      scopeText: '3 منتجات',
      startsText: '١٢ يناير ٢٠٢٤',
      endsText: '٢٦ يناير ٢٠٢٤',
    });
  });
});
