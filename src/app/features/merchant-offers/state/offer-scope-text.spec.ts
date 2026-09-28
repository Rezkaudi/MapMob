import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { describeOfferScope, describeOfferScopeInTable } from './offer-scope-text';

describe('describeOfferScopeInTable', () => {
  it('counts the picked products, or says it covers them all', () => {
    expect(describeOfferScopeInTable(buildMerchantOffer())).toBe('3 منتجات');
    expect(describeOfferScopeInTable(buildMerchantOffer({ itemIds: ['a', 'b'] }))).toBe('منتجين');
    expect(describeOfferScopeInTable(buildMerchantOffer({ itemIds: ['a'] }))).toBe('منتج واحد');
    expect(describeOfferScopeInTable(buildMerchantOffer({ scope: 'allItems', itemIds: [] }))).toBe(
      'جميع المنتجات',
    );
  });
});

describe('describeOfferScope', () => {
  it('writes the sentence after "النطاق:" in the drawer', () => {
    expect(describeOfferScope(buildMerchantOffer({ scope: 'allItems', itemIds: [] }))).toBe(
      'يشمل جميع المنتجات',
    );
    expect(describeOfferScope(buildMerchantOffer())).toBe('يشمل 3 منتجات محددة');
  });
});
