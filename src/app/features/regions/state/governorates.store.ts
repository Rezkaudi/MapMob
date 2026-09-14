import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { GovernorateRepository } from '../data/governorate.repository';
import { RegionDraft } from '../models/region-draft';
import { RegionSort } from '../models/region-sort';
import { RegionStatus } from '../models/region-status';
import { withRegionTable } from './with-region-table';

export const GovernoratesStore = signalStore(
  { providedIn: 'root' },
  withRegionTable(),
  withMethods((store, repository = inject(GovernorateRepository)) => ({
    loadGovernorates: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getGovernorates(store.currentQuery()).pipe(
            tap((page) => store.showPage(page)),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
  withMethods((store, repository = inject(GovernorateRepository)) => {
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, () => store.loadGovernorates(), onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadGovernorates();
      },
      setSort(sort: RegionSort | null): void {
        store.applyQuery({ sort });
        store.loadGovernorates();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadGovernorates();
      },
      createGovernorate(draft: RegionDraft): Promise<boolean> {
        return saveThenReload(repository.createGovernorate(draft));
      },
      updateGovernorate(id: string, draft: RegionDraft): Promise<boolean> {
        return saveThenReload(repository.updateGovernorate(id, draft));
      },
      changeStatus(id: string, status: RegionStatus): Promise<boolean> {
        return saveThenReload(repository.setGovernorateStatus(id, status));
      },
      deleteGovernorate(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteGovernorate(id), () => store.forgetRemovedEntry(id));
      },
    };
  }),
);
