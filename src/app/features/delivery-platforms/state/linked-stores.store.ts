import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { DeliveryPlatformRepository } from '../data/delivery-platform.repository';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { LinkedStore } from '../models/linked-store';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { LinkedStoreFilter } from '../models/linked-store-filter';
import { listStoreCategories } from './linked-store-filter';
import { buildLinkedStoreRows } from './linked-store-rows';

const NO_STORES_MESSAGE = 'لا توجد متاجر مرتبطة بهذه المنصة بعد';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface LinkedStoresState {
  readonly platform: DeliveryPlatformEntry | null;
  readonly stores: readonly LinkedStore[];
  readonly search: string;
  readonly categoryId: string | null;
  readonly categoryOptions: readonly SelectOption[];
}

const initialState: LinkedStoresState = {
  platform: null,
  stores: [],
  search: '',
  categoryId: null,
  categoryOptions: [],
};

/** The "عرض المتاجر المرتبطة" dialog: one platform's stores, searched by the server. */
export const LinkedStoresStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ stores, search, categoryId }) => ({
    rows: computed(() => buildLinkedStoreRows(stores())),
    emptyMessage: computed(() =>
      search().trim() || categoryId() ? NO_MATCHES_MESSAGE : NO_STORES_MESSAGE,
    ),
  })),
  withMethods((store, repository = inject(DeliveryPlatformRepository)) => {
    const currentFilter = (): LinkedStoreFilter => ({
      search: store.search(),
      categoryId: store.categoryId(),
    });

    // The first list has no filter, so it holds every category the dialog can offer.
    const loadStores = rxMethod<string>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((platformId) =>
          repository.getLinkedStores(platformId, currentFilter()).pipe(
            tap((stores) => {
              const isFirstList = store.categoryOptions().length === 0;
              patchState(store, {
                stores,
                ...(isFirstList ? { categoryOptions: listStoreCategories(stores) } : {}),
              });
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

    const reload = (): void => {
      const platform = store.platform();
      if (platform) {
        loadStores(platform.id);
      }
    };

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
        reload();
      },
      setCategory(categoryId: string | null): void {
        patchState(store, { categoryId });
        reload();
      },
    };
  }),
);
