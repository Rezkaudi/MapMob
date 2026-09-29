import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { DeliveryPlatformRepository } from '../data/delivery-platform.repository';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { LinkedStore } from '../models/linked-store';
import { filterLinkedStores, listStoreCategories } from './linked-store-filter';
import { buildLinkedStoreRows } from './linked-store-rows';

const NO_STORES_MESSAGE = 'لا توجد متاجر مرتبطة بهذه المنصة بعد';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface LinkedStoresState {
  readonly platform: DeliveryPlatformEntry | null;
  readonly stores: readonly LinkedStore[];
  readonly search: string;
  readonly categoryId: string | null;
}

const initialState: LinkedStoresState = {
  platform: null,
  stores: [],
  search: '',
  categoryId: null,
};

/** The "عرض المتاجر المرتبطة" dialog: one platform's stores, searched in place. */
export const LinkedStoresStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ stores, search, categoryId }) => {
    const visibleStores = computed(() =>
      filterLinkedStores(stores(), { search: search(), categoryId: categoryId() }),
    );
    return {
      rows: computed(() => buildLinkedStoreRows(visibleStores())),
      categoryOptions: computed(() => listStoreCategories(stores())),
      emptyMessage: computed(() => (stores().length ? NO_MATCHES_MESSAGE : NO_STORES_MESSAGE)),
    };
  }),
  withMethods((store, repository = inject(DeliveryPlatformRepository)) => {
    const loadStores = rxMethod<string>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((platformId) =>
          repository.getLinkedStores(platformId).pipe(
            tap((stores) => {
              patchState(store, { stores });
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return EMPTY;
            }),
          ),
        ),
      ),
    );

    return {
      open(platform: DeliveryPlatformEntry): void {
        patchState(store, { ...initialState, platform });
        loadStores(platform.id);
      },
      close(): void {
        patchState(store, initialState);
        store.clearError();
      },
      setSearch(search: string): void {
        patchState(store, { search });
      },
      setCategory(categoryId: string | null): void {
        patchState(store, { categoryId });
      },
    };
  }),
);
