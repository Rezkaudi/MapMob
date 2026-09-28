import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { describeOfferQuota } from './offer-quota';

describe('describeOfferQuota', () => {
  it('counts only live offers (running or scheduled) against the plan, in offers', () => {
    const offers = [
      buildMerchantOffer({ id: '1', status: 'active' }),
      buildMerchantOffer({ id: '2', status: 'scheduled' }),
      buildMerchantOffer({ id: '3', status: 'active' }),
      buildMerchantOffer({ id: '4', status: 'expired' }),
      buildMerchantOffer({ id: '5', status: 'paused' }),
      buildMerchantOffer({ id: '6', status: 'draft' }),
    ];

    expect(describeOfferQuota(offers, 5)).toEqual(
      expect.objectContaining({
        usedCount: 3,
        limitText: '/ 5 عروض',
        remainingChipText: 'متبقي لك عرضان',
        notice: 'متبقي لك عرضان ضمن باقتك الحالية قبل الوصول للحد المتاح.',
      }),
    );
  });

  it('says live offers are not capped on a plan with no limit', () => {
    expect(describeOfferQuota([], null).notice).toBe('باقتك الحالية لا تحدّ عدد العروض النشطة.');
  });
});
