import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { AreaRepository } from '../data/area.repository';
import { GovernorateRepository } from '../data/governorate.repository';
import { Governorate } from '../models/governorate';
import { RegionDraft } from '../models/region-draft';
import { RegionSort } from '../models/region-sort';
import { RegionStatus } from '../models/region-status';
import { withRegionTable } from './with-region-table';

interface AreasState {
  readonly governorateId: string;
  readonly governorate: Governorate | null;
}

const initialState: AreasState = {
  governorateId: '',
  governorate: null,
};

export const AreasStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRegionTable(),
  withComputed(({ governorate }) => ({
    governorateName: computed(() => governorate()?.name ?? ''),
  })),
  withMethods(
    (
      store,
      areaRepository = inject(AreaRepository),
      governorateRepository = inject(GovernorateRepository),
    ) => ({
      loadAreas: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            areaRepository
              .getAreas({ governorateId: store.governorateId(), ...store.currentQuery() })
              .pipe(
                tap((page) => store.showPage(page)),
                catchError((error: Error) => {
                  store.setError(error.message);
                  return of(null);
                }),
              ),
          ),
        ),
      ),
      loadGovernorate: rxMethod<void>(
        pipe(
          switchMap(() =>
            governorateRepository.getGovernorate(store.governorateId()).pipe(
              tap((governorate) => patchState(store, { governorate })),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withMethods((store, areaRepository = inject(AreaRepository)) => {
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, () => store.loadAreas(), onSaved);

    return {
      openGovernorate(governorateId: string): void {
        patchState(store, { governorateId, governorate: null });
        store.applyQuery({ search: '', sort: null });
        // Areas first: starting their load clears any error, so a missing governorate stays reported.
        store.loadAreas();
        store.loadGovernorate();
      },
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadAreas();
      },
      setSort(sort: RegionSort | null): void {
        store.applyQuery({ sort });
        store.loadAreas();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadAreas();
      },
      createArea(draft: RegionDraft): Promise<boolean> {
        return saveThenReload(areaRepository.createArea(store.governorateId(), draft));
      },
      updateArea(id: string, draft: RegionDraft): Promise<boolean> {
        return saveThenReload(areaRepository.updateArea(id, draft));
      },
      changeStatus(id: string, status: RegionStatus): Promise<boolean> {
        return saveThenReload(areaRepository.setAreaStatus(id, status));
      },
      deleteArea(id: string): Promise<boolean> {
        return saveThenReload(areaRepository.deleteArea(id), () => store.forgetRemovedEntry(id));
      },
    };
  }),
);
