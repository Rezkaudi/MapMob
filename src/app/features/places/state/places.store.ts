import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap, tap, catchError, lastValueFrom, of } from 'rxjs';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withPagination } from '../../../shared/state/with-pagination';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { withSelection } from '../../../shared/state/with-selection';
import { PlaceRepository } from '../data/place.repository';
import { Place } from '../models/place';
import { PlacePackage } from '../models/place-package';
import { PlaceQuery } from '../models/place-query';
import { PlaceSort } from '../models/place-sort';
import { PlaceStatus } from '../models/place-status';
import { PlaceStatusCounts } from '../models/place-status-counts';

interface PlacesState {
  readonly places: readonly Place[];
  readonly search: string;
  readonly status: PlaceStatus | null;
  readonly category: string | null;
  readonly package: PlacePackage | null;
  readonly sort: PlaceSort | null;
  readonly statusCounts: PlaceStatusCounts;
  readonly isExporting: boolean;
}

/** The design lists eight places per page. */
const PLACES_PAGE_SIZE = 8;

const EMPTY_STATUS_COUNTS: PlaceStatusCounts = { all: 0, active: 0, pending: 0, suspended: 0 };

const initialState: PlacesState = {
  places: [],
  search: '',
  status: null,
  category: null,
  package: null,
  sort: null,
  statusCounts: EMPTY_STATUS_COUNTS,
  isExporting: false,
};

export const PlacesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withPagination(),
  withSelection(),
  withSaveStatus(),
  withHooks({
    onInit(store) {
      store.setPageSize(PLACES_PAGE_SIZE);
    },
  }),
  withComputed(({ places, isLoading, selectedIdSet }) => ({
    hasNoResults: computed(() => !isLoading() && places().length === 0),
    selectedCount: computed(() => selectedIdSet().size),
    hasSelection: computed(() => selectedIdSet().size > 0),
    areAllVisibleSelected: computed(
      () => places().length > 0 && places().every((place) => selectedIdSet().has(place.id)),
    ),
  })),
  withMethods((store, repository = inject(PlaceRepository)) => {
    const currentQuery = (): PlaceQuery => ({
      pageIndex: store.pageIndex(),
      pageSize: store.pageSize(),
      search: store.search() || undefined,
      status: store.status() ?? undefined,
      category: store.category() ?? undefined,
      package: store.package() ?? undefined,
      sort: store.sort() ?? undefined,
    });

    return {
      currentQuery,
      loadPlaces: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getPlaces(currentQuery()).pipe(
              tap((page) => {
                patchState(store, { places: page.items });
                store.setTotalCount(page.totalCount);
                store.setLoaded();
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      loadStatusCounts: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getStatusCounts().pipe(
              tap((statusCounts) => patchState(store, { statusCounts })),
              catchError(() => of(null)),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(PlaceRepository)) => {
    /** Any filter change invalidates the current page, so the ticked rows go with it. */
    const applyFilter = (patch: Partial<PlacesState>): void => {
      patchState(store, patch);
      store.clearSelection();
      store.goToPage(0);
      store.loadPlaces();
    };

    const reloadAll = (): void => {
      store.loadPlaces();
      store.loadStatusCounts();
    };

    const saveThenReload = async (
      request: Observable<unknown>,
      onSaved: () => void = () => undefined,
    ): Promise<boolean> => {
      const isSaved = await store.runSave(request);
      if (isSaved) {
        onSaved();
        reloadAll();
      }
      return isSaved;
    };

    /** The last rows of a later page would leave the reload showing nothing. */
    const stepBackWhenPageEmptied = (removedCount: number): void => {
      if (removedCount >= store.places().length && store.pageIndex() > 0) {
        store.goToPage(store.pageIndex() - 1);
      }
    };

    return {
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadPlaces();
      },
      setSearch(search: string): void {
        applyFilter({ search });
      },
      setStatusFilter(status: PlaceStatus | null): void {
        applyFilter({ status });
      },
      setCategoryFilter(category: string | null): void {
        applyFilter({ category });
      },
      setPackageFilter(placePackage: PlacePackage | null): void {
        applyFilter({ package: placePackage });
      },
      setSort(sort: PlaceSort | null): void {
        applyFilter({ sort });
      },
      toggleAllVisible(): void {
        if (store.areAllVisibleSelected()) {
          store.clearSelection();
          return;
        }
        store.selectAll(store.places().map((place) => place.id));
      },
      changeStatus(ids: readonly string[], status: ActivationStatus): Promise<boolean> {
        return saveThenReload(repository.setPlacesStatus(ids, status), () =>
          store.clearSelection(),
        );
      },
      deletePlaces(ids: readonly string[]): Promise<boolean> {
        return saveThenReload(repository.deletePlaces(ids), () => {
          stepBackWhenPageEmptied(ids.length);
          store.clearSelection();
        });
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportPlaces(ids: readonly string[]): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          return await lastValueFrom(repository.exportPlaces({ query: store.currentQuery(), ids }));
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
