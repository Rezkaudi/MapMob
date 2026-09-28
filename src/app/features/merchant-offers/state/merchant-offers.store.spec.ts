import { TestBed } from '@angular/core/testing';
import { CLOCK } from '../../../core/config/clock';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { buildMerchantOffer } from '../testing/merchant-offer-fixture';
import { FakeMerchantOfferRepository } from '../testing/fake-merchant-offer-repository';
import { MerchantOffersStore } from './merchant-offers.store';

const NOW = new Date('2026-09-10T12:00:00.000Z');
const AUTUMN = buildMerchantOffer({
  id: '1',
  title: 'خصم الخريف',
  createdAt: '2026-08-01T00:00:00.000Z',
});
const SUMMER = buildMerchantOffer({
  id: '2',
  title: 'عرض الصيف',
  status: 'expired',
  scope: 'allItems',
  itemIds: [],
  startsOn: '2026-07-01',
  endsOn: '2026-07-31',
  createdAt: '2026-06-01T00:00:00.000Z',
});

function setUp(configure: (repository: FakeMerchantOfferRepository) => void = () => undefined) {
  const repository = new FakeMerchantOfferRepository();
  repository.catalog = { ...repository.catalog, items: [AUTUMN, SUMMER] };
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      MerchantOffersStore,
      { provide: MerchantOfferRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const store = TestBed.inject(MerchantOffersStore);
  store.load();
  return { store, repository };
}

const rowIds = (store: ReturnType<typeof setUp>['store']) =>
  store.rows().map((row) => row.offer.id);

describe('MerchantOffersStore', () => {
  it('loads the offers, the count tiles and the plan quota', () => {
    const { store } = setUp();

    expect(rowIds(store)).toEqual(['1', '2']);
    expect(store.countTiles().map((tile) => tile.count)).toEqual([2, 1, 1]);
    expect(store.planName()).toBe('الباقة المجانية');
    expect(store.quota()?.limitText).toBe('/ 5 عروض');
    expect(store.quota()?.usedCount).toBe(1);
  });

  it('keeps the load error for the page to show', () => {
    const { store } = setUp((fake) => (fake.failure = new Error('انقطع الاتصال')));

    expect(store.error()).toBe('انقطع الاتصال');
  });

  it('searches, sorts and filters the rows without touching the counts', () => {
    const { store } = setUp();

    store.setSearch('الصيف');
    expect(rowIds(store)).toEqual(['2']);
    store.setSearch('');
    store.setSort('newest');
    expect(rowIds(store)).toEqual(['1', '2']);

    store.applyFilters({ ...store.filters(), status: 'expired', period: 'today' });
    expect(rowIds(store)).toEqual([]);
    expect(store.activeFilterCount()).toBe(2);
    expect(store.countTiles()[0].count).toBe(2);
  });

  it('says "nothing matched" when a search hides every row', () => {
    const { store } = setUp();

    store.setSearch('غير موجود');

    expect(store.hasNoRows()).toBe(true);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });

  it('says "no offers yet" when the place has none', () => {
    const { store } = setUp((fake) => (fake.catalog = { ...fake.catalog, items: [] }));

    expect(store.hasNoRows()).toBe(true);
    expect(store.emptyMessage()).toBe('لم تضف أي عرض بعد');
  });

  it('ticks every visible row, then clears them all', () => {
    const { store } = setUp();

    store.toggleAllVisible();
    expect(store.areAllVisibleSelected()).toBe(true);
    store.toggleAllVisible();
    expect(store.selectedIds()).toEqual([]);
  });

  it('opens the details of one offer with its scope line and pause action', () => {
    const { store } = setUp();

    store.openDetails('1');

    expect(store.detail()).toEqual({
      offer: AUTUMN,
      scopeText: 'يشمل 3 منتجات محددة',
      pauseAction: 'pause',
    });
    store.closeDialog();
    expect(store.detail()).toBeNull();
  });

  it('pauses and resumes the open offer, keeping the drawer on it', async () => {
    const { store, repository } = setUp();
    store.openDetails('1');

    await store.pauseOpenOffer();
    expect(repository.paused).toEqual(['1']);
    expect(store.detail()?.pauseAction).toBe('resume');

    await store.resumeOpenOffer();
    expect(repository.resumed).toEqual(['1']);
    expect(store.detail()?.offer.status).toBe('active');
  });

  it('asks before deleting, then drops the row, its tick and the drawer', async () => {
    const { store, repository } = setUp();
    store.toggleSelected('1');
    store.openDetails('1');

    store.openDelete(AUTUMN);
    expect(store.deleteCopy()?.question).toBe('هل أنت متأكد من حذف عرض "خصم الخريف"؟');
    await store.confirmDelete();

    expect(repository.deleted).toEqual(['1']);
    expect(rowIds(store)).toEqual(['2']);
    expect(store.selectedIds()).toEqual([]);
    expect(store.deleteCopy()).toBeNull();
    expect(store.detail()).toBeNull();
  });

  it('keeps the drawer open with the error when a pause fails', async () => {
    const { store, repository } = setUp();
    store.openDetails('1');
    repository.failure = new Error('تعذر الإيقاف');

    await store.pauseOpenOffer();

    expect(store.detail()?.offer.status).toBe('active');
    expect(store.saveError()).toBe('تعذر الإيقاف');
    store.clearSaveError();
    expect(store.saveError()).toBeNull();
  });
});
