import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { OfferRepository } from '../data/offer.repository';
import { Offer } from '../models/offer';
import { NO_OFFER_FILTERS, OfferFilters } from '../models/offer-filters';
import { OfferQuery } from '../models/offer-query';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { countActiveOfferFilters } from './count-active-offer-filters';
import { buildOfferStatCards } from './offer-stat-cards';

/** The offers design draws four rows per page. */
export const OFFERS_PAGE_SIZE = 4;

const NO_OFFERS_MESSAGE = 'لا توجد عروض لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface OffersState {
  readonly filters: OfferFilters;
  readonly summary: CampaignSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: OffersState = {
  filters: NO_OFFER_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const OffersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Offer>({ pageSize: OFFERS_PAGE_SIZE }),
  withComputed(({ filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveOfferFilters(filters()));
    return {
      activeFilterCount,
      statCards: computed(() => buildOfferStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing added at all: the page swaps everything below its title for the empty message. */
      hasNoOffers: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_OFFERS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(OfferRepository)) => {
    const currentOfferQuery = (): OfferQuery => {
      const { status, runningRange } = store.filters();
      return {
        ...store.currentQuery(),
        ...(status ? { status } : {}),
        ...(runningRange.from ? { runningFrom: runningRange.from } : {}),
        ...(runningRange.to ? { runningTo: runningRange.to } : {}),
      };
    };

    const loadOffers = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getOffers(currentOfferQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
                loadOffers();
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
      currentOfferQuery,
      loadOffers,

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
  withMethods((store, repository = inject(OfferRepository)) => {
    const reloadAll = () => {
      store.loadOffers();
      store.loadSummary();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadOffers();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadOffers();
      },
      applyFilters(filters: OfferFilters): void {
        patchState(store, { filters });
        store.resetToFirstPage();
        store.loadOffers();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadOffers();
      },
      pauseOffer(id: string): Promise<boolean> {
        return saveThenReload(repository.pauseOffer(id));
      },
      resumeOffer(id: string): Promise<boolean> {
        return saveThenReload(repository.resumeOffer(id));
      },
      deleteOffer(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteOffer(id), () => store.forgetRemovedEntry(id));
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportOffers(): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          return await lastValueFrom(repository.exportOffers(store.currentOfferQuery()));
        } catch (error) {
          patchState(store, { saveError: (error as Error).message });
          return null;
        } finally {
          patchState(store, { isExporting: false });
        }
      },
    };
  }),
);
