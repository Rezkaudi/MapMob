import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { OfferRepository } from '../data/offer.repository';
import { NO_OFFER_FILTERS } from '../models/offer-filters';
import { OfferQuery } from '../models/offer-query';
import { buildOffer } from '../testing/offer-fixture';
import { OFFERS_PAGE_SIZE, OffersStore } from './offers.store';

const WINTER = buildOffer();
const SUMMARY = { totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 4 };

function createStore(overrides: Partial<OfferRepository> = {}) {
  const requestedQueries: OfferQuery[] = [];
  let summaryLoads = 0;
  const repository: Partial<OfferRepository> = {
    getOffers: (query) => {
      requestedQueries.push(query);
      return of({ items: [WINTER], totalCount: 1 });
    },
    getSummary: () => {
      summaryLoads += 1;
      return of(SUMMARY);
    },
    pauseOffer: () => of(buildOffer({ status: 'paused' })),
    resumeOffer: () => of(buildOffer()),
    deleteOffer: () => of(undefined),
    exportOffers: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [{ provide: OfferRepository, useValue: repository }],
  });
  return {
    store: TestBed.inject(OffersStore),
    requestedQueries,
    summaryLoads: () => summaryLoads,
  };
}

describe('OffersStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(OFFERS_PAGE_SIZE);
    expect(OFFERS_PAGE_SIZE).toBe(4);
  });

  it('loads a page of offers and the summary, then builds the stat cards', () => {
    const { store } = createStore();

    store.loadOffers();
    store.loadSummary();

    expect(store.entries()).toEqual([WINTER]);
    expect(store.totalCount()).toBe(1);
    expect(store.isSummaryLoading()).toBe(false);
    expect(store.statCards().map((card) => card.value)).toEqual(['34', '16', '14', '4']);
  });

  it('reports a failed load, and a failed summary without blocking the page', () => {
    const { store } = createStore({
      getOffers: () => throwError(() => new Error('تعذر التحميل')),
      getSummary: () => throwError(() => new Error('تعذر')),
    });

    store.loadOffers();
    store.loadSummary();

    expect(store.error()).toBe('تعذر التحميل');
    expect(store.isSummaryLoading()).toBe(false);
  });

  it('turns the applied filters into the query and starts again from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(2);

    store.applyFilters({ status: 'scheduled', runningRange: { from: '2026-08-01', to: null } });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      status: 'scheduled',
      runningFrom: '2026-08-01',
    });
    expect(store.activeFilterCount()).toBe(2);
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();

    store.setSearch(' خصم ');
    store.setSort('name');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: 'خصم',
      sort: 'name',
    });
  });

  it('tells "nothing added yet" apart from "nothing matches"', () => {
    const { store } = createStore({ getOffers: () => of({ items: [], totalCount: 0 }) });

    store.loadOffers();
    expect(store.hasNoOffers()).toBe(true);

    store.applyFilters({ ...NO_OFFER_FILTERS, status: 'draft' });
    expect(store.hasNoOffers()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('pauses, resumes and deletes, then reloads the page and the summary', async () => {
    const { store, requestedQueries, summaryLoads } = createStore();

    expect(await store.pauseOffer('offer-1')).toBe(true);
    expect(await store.resumeOffer('offer-1')).toBe(true);
    expect(await store.deleteOffer('offer-1')).toBe(true);

    expect(requestedQueries).toHaveLength(3);
    expect(summaryLoads()).toBe(3);
  });

  it('keeps the save error when a change fails', async () => {
    const { store } = createStore({
      pauseOffer: () => throwError(() => new Error('تعذر إيقاف العرض')) as Observable<never>,
    });

    expect(await store.pauseOffer('offer-1')).toBe(false);
    expect(store.saveError()).toBe('تعذر إيقاف العرض');
  });

  it('exports with the current query, or reports why it could not', async () => {
    const { store } = createStore();
    expect(await store.exportOffers()).toBeInstanceOf(Blob);

    TestBed.resetTestingModule();
    const failing = createStore({
      exportOffers: () => throwError(() => new Error('تعذر التصدير')),
    });
    expect(await failing.store.exportOffers()).toBeNull();
    expect(failing.store.saveError()).toBe('تعذر التصدير');
    expect(failing.store.isExporting()).toBe(false);
  });
});
