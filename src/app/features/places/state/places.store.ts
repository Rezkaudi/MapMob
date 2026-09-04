import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withPagination } from '../../../shared/state/with-pagination';
import { PlaceRepository } from '../data/place.repository';
import { Place } from '../models/place';
import { PlaceStatus } from '../models/place-status';

interface PlacesState {
  readonly places: readonly Place[];
  readonly search: string;
  readonly status: PlaceStatus | null;
}

const initialState: PlacesState = {
  places: [],
  search: '',
  status: null,
};

export const PlacesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withPagination(),
  withComputed(({ places, isLoading }) => ({
    hasNoResults: computed(() => !isLoading() && places().length === 0),
  })),
  withMethods((store, repository = inject(PlaceRepository)) => ({
    loadPlaces: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository
            .getPlaces({
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.search() || undefined,
              status: store.status() ?? undefined,
            })
            .pipe(
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
  })),
  withMethods((store) => ({
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.loadPlaces();
    },
    setSearch(search: string): void {
      patchState(store, { search });
      store.goToPage(0);
      store.loadPlaces();
    },
    setStatusFilter(status: PlaceStatus | null): void {
      patchState(store, { status });
      store.goToPage(0);
      store.loadPlaces();
    },
  })),
);
