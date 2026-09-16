import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdRepository } from '../data/ad.repository';
import { AdQuery } from '../models/ad-query';
import { NO_AD_FILTERS } from '../models/ad-filters';
import { buildAd } from '../testing/ad-fixture';
import { ADS_PAGE_SIZE, AdsStore } from './ads.store';

const SUMMARY = { totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 23 };

function createStore(overrides: Partial<AdRepository> = {}) {
  const requestedQueries: AdQuery[] = [];
  const repository: Partial<AdRepository> = {
    getAds: (query) => {
      requestedQueries.push(query);
      return of({ items: [buildAd()], totalCount: 1 });
    },
    getSummary: () => of(SUMMARY),
    deleteAd: () => of(undefined),
    exportAds: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({ providers: [{ provide: AdRepository, useValue: repository }] });
  return { store: TestBed.inject(AdsStore), requestedQueries };
}

describe('AdsStore', () => {
  it('draws four rows per page and loads a page with the stat cards', () => {
    const { store } = createStore();

    store.loadAds();
    store.loadSummary();

    expect(ADS_PAGE_SIZE).toBe(4);
    expect(store.entries()).toHaveLength(1);
    expect(store.statCards().map((card) => card.value)).toEqual(['34', '16', '14', '23']);
  });

  it('turns every applied filter into the query, from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(3);

    store.applyFilters({
      status: 'paused',
      contentType: 'image',
      advertiserType: 'place',
      placement: 'searchResults',
      runningRange: { from: null, to: '2026-09-02' },
    });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      status: 'paused',
      contentType: 'image',
      advertiserType: 'place',
      placement: 'searchResults',
      runningTo: '2026-09-02',
    });
    expect(store.activeFilterCount()).toBe(5);
  });

  it('tells "nothing added yet" apart from "nothing matches"', () => {
    const { store } = createStore({ getAds: () => of({ items: [], totalCount: 0 }) });

    store.loadAds();
    expect(store.hasNoAds()).toBe(true);

    store.setSearch('حملة');
    expect(store.hasNoAds()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('deletes and reloads, and keeps an export error', async () => {
    const { store, requestedQueries } = createStore({
      exportAds: () => throwError(() => new Error('تعذر التصدير')),
    });

    expect(await store.deleteAd('ad-1')).toBe(true);
    expect(requestedQueries).toHaveLength(1);
    expect(await store.exportAds()).toBeNull();
    expect(store.saveError()).toBe('تعذر التصدير');
    expect(store.filters()).toEqual(NO_AD_FILTERS);
  });
});
