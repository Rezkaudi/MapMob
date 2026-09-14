import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { GovernorateRepository } from '../data/governorate.repository';
import { RegionDraft } from '../models/region-draft';
import { RegionEntry } from '../models/region-entry';
import { RegionStatus } from '../models/region-status';

export const GovernoratesStore = signalStore(
  { providedIn: 'root' },
  withListTable<RegionEntry>(),
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
      setSort(sort: ListSort | null): void {
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
