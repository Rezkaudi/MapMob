import { LiveOffer } from './live-offer';
import {
  toCampaignSummary,
  toOffer,
  toOfferDetail,
  toOfferFormOptions,
} from './live-offer-mapping';

const TODAY = '2026-10-13';
const LIVE_OFFER: LiveOffer = {
  id: 1,
  store_id: 4,
  store_name: 'متجر السعادة',
  product_id: 9,
  scope: { type: 'single_product', product_id: 9, product_name: 'مرتديلا' },
  title: 'عرض الشهر',
  description: 'عرض مميز',
  image: 'https://api.test/storage/offers/a.jpg',
  discount_percentage: '20.00',
  starts_at: '2026-09-22T00:00:00.000000Z',
  ends_at: '2026-12-22T00:00:00.000000Z',
  status: 'active',
};

describe('toOffer', () => {
  it('turns a server offer into a table row', () => {
    expect(toOffer(LIVE_OFFER, TODAY)).toEqual({
      id: '1',
      title: 'عرض الشهر',
      placeName: 'متجر السعادة',
      categoryName: '',
      startsOn: '2026-09-22',
      endsOn: '2026-12-22',
      status: 'active',
    });
  });

  it('works out scheduled and expired from the days of an active offer', () => {
    expect(toOffer(LIVE_OFFER, '2026-09-21').status).toBe('scheduled');
    expect(toOffer(LIVE_OFFER, '2026-12-23').status).toBe('expired');
  });

  it('reads a stopped offer as paused whatever its days are', () => {
    expect(toOffer({ ...LIVE_OFFER, status: 'inactive' }, TODAY).status).toBe('paused');
    expect(toOffer({ ...LIVE_OFFER, status: 'paused' }, '2026-12-23').status).toBe('paused');
  });
});

describe('toOfferDetail', () => {
  it('reads a one-product offer as an offer on picked items', () => {
    expect(toOfferDetail(LIVE_OFFER, TODAY)).toEqual({
      offer: toOffer(LIVE_OFFER, TODAY),
      description: 'عرض مميز',
      place: { id: '4', name: 'متجر السعادة', categoryName: '', address: '' },
      discountPercent: 20,
      scope: 'selectedItems',
      itemIds: ['9'],
      imageUrl: 'https://api.test/storage/offers/a.jpg',
    });
  });

  it('reads an offer with no product as an offer on everything', () => {
    const detail = toOfferDetail(
      {
        ...LIVE_OFFER,
        product_id: null,
        scope: { type: 'all_products', product_id: null, product_name: null },
        description: null,
        image: null,
      },
      TODAY,
    );

    expect(detail.scope).toBe('allItems');
    expect(detail.itemIds).toEqual([]);
    expect(detail.description).toBe('');
    expect(detail.imageUrl).toBeNull();
  });
});

describe('toCampaignSummary', () => {
  it('renames the four counts', () => {
    expect(toCampaignSummary({ total: 9, active: 4, scheduled: 3, expired_or_stopped: 2 })).toEqual(
      {
        totalCount: 9,
        activeCount: 4,
        scheduledCount: 3,
        endedCount: 2,
      },
    );
  });
});

describe('toOfferFormOptions', () => {
  it('lists the stores as places and the main categories by name', () => {
    expect(
      toOfferFormOptions({ stores: [{ id: 4, name: 'متجر السعادة' }] }, [
        { id: '1', name: 'مطاعم' },
        { id: '2', name: 'صيدليات' },
      ]),
    ).toEqual({
      places: [{ id: '4', name: 'متجر السعادة', categoryName: '', address: '' }],
      categoryNames: ['مطاعم', 'صيدليات'],
    });
  });
});
