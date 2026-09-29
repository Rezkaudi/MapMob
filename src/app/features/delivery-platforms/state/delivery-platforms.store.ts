import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { DeliveryPlatformRepository } from '../data/delivery-platform.repository';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { buildDeliveryPlatformStatCards } from './delivery-platform-stat-cards';

/** The frame draws four rows under the header. */
const PLATFORM_PAGE_SIZE = 4;
const NO_PLATFORMS_MESSAGE = 'لا توجد منصات مضافة حتى الآن';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface DeliveryPlatformsState {
  readonly summary: DeliveryPlatformSummary | null;
  readonly isSummaryLoading: boolean;
}

const initialState: DeliveryPlatformsState = {
  summary: null,
  isSummaryLoading: false,
};

export const DeliveryPlatformsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<DeliveryPlatformEntry>({ pageSize: PLATFORM_PAGE_SIZE }),
  withComputed(({ search, summary }) => ({
    statCards: computed(() => buildDeliveryPlatformStatCards(summary())),
    emptyMessage: computed(() => (search().trim() ? NO_MATCHES_MESSAGE : NO_PLATFORMS_MESSAGE)),
    nextSortOrder: computed(() => (summary()?.platformCount ?? 0) + 1),
  })),
  withMethods((store, repository = inject(DeliveryPlatformRepository)) => {
    const loadPlatforms = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getPlatforms(store.currentQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
                loadPlatforms();
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

    const loadSummary = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isSummaryLoading: true })),
        switchMap(() =>
          repository.getSummary().pipe(
            tap((summary) => patchState(store, { summary, isSummaryLoading: false })),
            // The cards keep their last numbers; the table reports its own errors.
            catchError(() => {
              patchState(store, { isSummaryLoading: false });
              return of(null);
            }),
          ),
        ),
      ),
    );

    return { loadPlatforms, loadSummary };
  }),
  withMethods((store, repository = inject(DeliveryPlatformRepository)) => {
    const reloadAll = () => {
      store.loadPlatforms();
      store.loadSummary();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadPlatforms();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadPlatforms();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadPlatforms();
      },
      createPlatform(draft: DeliveryPlatformDraft): Promise<boolean> {
        return saveThenReload(repository.createPlatform(draft));
      },
      updatePlatform(id: string, draft: DeliveryPlatformDraft): Promise<boolean> {
        return saveThenReload(repository.updatePlatform(id, draft));
      },
      changeStatus(id: string, status: DeliveryPlatformStatus): Promise<boolean> {
        return saveThenReload(repository.setPlatformStatus(id, status));
      },
      deletePlatform(id: string): Promise<boolean> {
        return saveThenReload(repository.deletePlatform(id), () => store.forgetRemovedEntry(id));
      },
    };
  }),
);
