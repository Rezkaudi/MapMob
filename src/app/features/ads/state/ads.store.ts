import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { AdRepository } from '../data/ad.repository';
import { Ad } from '../models/ad';
import { AdFilters, NO_AD_FILTERS } from '../models/ad-filters';
import { AdQuery } from '../models/ad-query';
import { buildAdStatCards } from './ad-stat-cards';
import { countActiveAdFilters } from './count-active-ad-filters';

/** The ads design draws four rows per page. */
export const ADS_PAGE_SIZE = 4;

const NO_ADS_MESSAGE = 'لا توجد إعلانات لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface AdsState {
  readonly filters: AdFilters;
  readonly summary: CampaignSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: AdsState = {
  filters: NO_AD_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const AdsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Ad>({ pageSize: ADS_PAGE_SIZE }),
  withComputed(({ filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveAdFilters(filters()));
    return {
      activeFilterCount,
      statCards: computed(() => buildAdStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing added at all: the page swaps everything below its title for the empty message. */
      hasNoAds: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_ADS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(AdRepository)) => {
    const currentAdQuery = (): AdQuery => {
      const { status, contentType, advertiserType, placement, runningRange } = store.filters();
      return {
        ...store.currentQuery(),
        ...(status ? { status } : {}),
        ...(contentType ? { contentType } : {}),
        ...(advertiserType ? { advertiserType } : {}),
        ...(placement ? { placement } : {}),
        ...(runningRange.from ? { runningFrom: runningRange.from } : {}),
        ...(runningRange.to ? { runningTo: runningRange.to } : {}),
      };
    };

    const loadAds = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getAds(currentAdQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
                loadAds();
              }
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    );

    return {
      currentAdQuery,
      loadAds,

      loadSummary: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, hasSummaryFailed: false })),
              catchError(() => {
                patchState(store, { hasSummaryFailed: true });
                return of(null);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(AdRepository)) => ({
    setSearch(search: string): void {
      store.applyQuery({ search });
      store.loadAds();
    },
    setSort(sort: ListSort | null): void {
      store.applyQuery({ sort });
      store.loadAds();
    },
    applyFilters(filters: AdFilters): void {
      patchState(store, { filters });
      store.resetToFirstPage();
      store.loadAds();
    },
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.clearSelection();
      store.loadAds();
    },
    deleteAd(id: string): Promise<boolean> {
      return store.saveThenRefresh(
        repository.deleteAd(id),
        () => {
          store.loadAds();
          store.loadSummary();
        },
        () => store.forgetRemovedEntry(id),
      );
    },
    /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
    async exportAds(): Promise<Blob | null> {
      patchState(store, { isExporting: true, saveError: null });
      try {
        return await lastValueFrom(repository.exportAds(store.currentAdQuery()));
      } catch (error) {
        patchState(store, { saveError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isExporting: false });
      }
    },
  })),
);
