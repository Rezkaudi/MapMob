import { ListSort } from '../../../shared/models/list-sort';
import { MerchantOfferFilters, NO_MERCHANT_OFFER_FILTERS } from '../models/merchant-offer-filters';
import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { filterMerchantOffers } from './filter-merchant-offers';

const TODAY = '2026-09-10';

const OFFERS = [
  buildMerchantOffer({
    id: 'autumn',
    title: 'خصم الخريف',
    status: 'active',
    scope: 'allItems',
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    createdAt: '2026-08-01T00:00:00.000Z',
  }),
  buildMerchantOffer({
    id: 'summer',
    title: 'عرض الصيف',
    status: 'expired',
    scope: 'selectedItems',
    startsOn: '2026-07-01',
    endsOn: '2026-08-20',
    createdAt: '2026-06-01T00:00:00.000Z',
  }),
  buildMerchantOffer({
    id: 'winter',
    title: 'تخفيضات الشتاء',
    status: 'scheduled',
    scope: 'selectedItems',
    startsOn: '2026-12-01',
    endsOn: '2026-12-31',
    createdAt: '2026-09-05T00:00:00.000Z',
  }),
];

function ids(
  filters: Partial<MerchantOfferFilters> = {},
  search = '',
  sort: ListSort | null = null,
) {
  return filterMerchantOffers(OFFERS, {
    search,
    sort,
    filters: { ...NO_MERCHANT_OFFER_FILTERS, ...filters },
    today: TODAY,
  }).map((offer) => offer.id);
}

describe('filterMerchantOffers', () => {
  it('keeps every offer in its own order with no search or filter', () => {
    expect(ids()).toEqual(['autumn', 'summer', 'winter']);
  });

  it('matches the title', () => {
    expect(ids({}, 'الشتاء')).toEqual(['winter']);
  });

  it('filters by status and by scope', () => {
    expect(ids({ status: 'expired' })).toEqual(['summer']);
    expect(ids({ scope: 'selectedItems' })).toEqual(['summer', 'winter']);
  });

  it('keeps offers running on at least one day of the picked period', () => {
    expect(ids({ period: 'today' })).toEqual(['autumn']);
    expect(ids({ period: 'last30Days' })).toEqual(['autumn', 'summer']);
    expect(
      ids({ period: 'custom', customRange: { from: '2026-11-15', to: '2026-12-02' } }),
    ).toEqual(['winter']);
  });

  it('ignores a custom period until both days are picked', () => {
    expect(ids({ period: 'custom', customRange: { from: '2026-12-01', to: null } })).toEqual([
      'autumn',
      'summer',
      'winter',
    ]);
  });

  it('sorts by newest, oldest or name', () => {
    expect(ids({}, '', 'newest')).toEqual(['winter', 'autumn', 'summer']);
    expect(ids({}, '', 'oldest')).toEqual(['summer', 'autumn', 'winter']);
    expect(ids({}, '', 'name')).toEqual(['winter', 'autumn', 'summer']);
  });
});
