import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withPagination } from '../../../shared/state/with-pagination';
import { RegionRepository } from '../data/region.repository';
import { Region } from '../models/region';

interface RegionsState {
  readonly regions: readonly Region[];
  readonly search: string;
}

const initialState: RegionsState = {
  regions: [],
  search: '',
};

export const RegionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withPagination(),
  withComputed(({ regions, isLoading }) => ({
    hasNoResults: computed(() => !isLoading() && regions().length === 0),
  })),
  withMethods((store, repository = inject(RegionRepository)) => ({
    loadRegions: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository
            .getRegions({
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.search() || undefined,
            })
            .pipe(
              tap((page) => {
                patchState(store, { regions: page.items });
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
      store.loadRegions();
    },
    setSearch(search: string): void {
      patchState(store, { search });
      store.goToPage(0);
      store.loadRegions();
    },
  })),
);
