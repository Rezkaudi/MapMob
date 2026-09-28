import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSelection } from '../../../shared/state/with-selection';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import { countProducts } from './product-counts';
import { describeProductQuota } from './product-quota';
import { filterProducts } from './filter-products';
import { toProductTableRow } from './product-table-rows';

const NO_PRODUCTS_MESSAGE = 'لم تضف أي منتج أو خدمة بعد';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface ProductCatalogState {
  readonly catalog: MerchantProductCatalog | null;
  readonly search: string;
  readonly sort: ListSort | null;
}

const initialState: ProductCatalogState = { catalog: null, search: '', sort: null };

/** The loaded products and what the page derives from them: rows, counts and the plan quota. */
export function withProductCatalog() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withSelection(),
    withComputed(({ catalog, search, sort, selectedIdSet }, clock = inject(CLOCK)) => {
      const products = computed(() => catalog()?.items ?? []);
      const visibleProducts = computed(() => filterProducts(products(), search(), sort()));
      return {
        products,
        rows: computed(() =>
          visibleProducts().map((product) => toProductTableRow(product, clock())),
        ),
        countTiles: computed(() => countProducts(products())),
        planName: computed(() => catalog()?.plan.name ?? ''),
        quota: computed(() => {
          const loaded = catalog();
          return loaded ? describeProductQuota(loaded.items.length, loaded.productLimit) : null;
        }),
        hasNoRows: computed(() => catalog() !== null && visibleProducts().length === 0),
        emptyMessage: computed(() =>
          products().length ? NO_MATCHES_MESSAGE : NO_PRODUCTS_MESSAGE,
        ),
        areAllVisibleSelected: computed(
          () =>
            visibleProducts().length > 0 &&
            visibleProducts().every((product) => selectedIdSet().has(product.id)),
        ),
      };
    }),
    withMethods((store) => {
      const replaceItems = (
        change: (items: readonly MerchantProduct[]) => readonly MerchantProduct[],
      ) => {
        const catalog = store.catalog();
        if (catalog) {
          patchState(store, { catalog: { ...catalog, items: change(catalog.items) } });
        }
      };
      return {
        setSearch(search: string): void {
          patchState(store, { search });
        },
        setSort(sort: ListSort | null): void {
          patchState(store, { sort });
        },
        toggleAllVisible(): void {
          if (store.areAllVisibleSelected()) {
            store.clearSelection();
            return;
          }
          store.selectAll(store.rows().map((row) => row.product.id));
        },
        addToCatalog(product: MerchantProduct): void {
          replaceItems((items) => [...items, product]);
        },
        replaceInCatalog(product: MerchantProduct): void {
          replaceItems((items) => items.map((item) => (item.id === product.id ? product : item)));
        },
        removeFromCatalog(id: string): void {
          replaceItems((items) => items.filter((item) => item.id !== id));
          store.keepOnlySelected(store.products().map((product) => product.id));
        },
      };
    }),
  );
}
