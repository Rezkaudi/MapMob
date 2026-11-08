import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSelection } from '../../../shared/state/with-selection';
import { MerchantProductRepository } from '../data/merchant-product.repository';
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
  /** What the server matched for the search and sort; `null` until one is picked. */
  readonly matchingProducts: readonly MerchantProduct[] | null;
  readonly search: string;
  readonly sort: ListSort | null;
}

const initialState: ProductCatalogState = {
  catalog: null,
  matchingProducts: null,
  search: '',
  sort: null,
};

/** The loaded products and what the page derives from them: rows, counts and the plan quota. */
export function withProductCatalog() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withSelection(),
    withComputed(
      ({ catalog, matchingProducts, search, sort, selectedIdSet }, clock = inject(CLOCK)) => {
        const products = computed(() => catalog()?.items ?? []);
        // The server ignores the sort today, so its answer is searched and sorted here too.
        const visibleProducts = computed(() =>
          filterProducts(matchingProducts() ?? products(), search(), sort()),
        );
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
      },
    ),
    withMethods((store, repository = inject(MerchantProductRepository)) => {
      // A failed read keeps the full list, which the page searches on its own.
      const loadMatching = rxMethod<void>(
        pipe(
          switchMap(() =>
            repository
              .getProducts({ search: store.search(), sort: store.sort() })
              .pipe(catchError(() => of(null))),
          ),
          tap((matchingProducts) => patchState(store, { matchingProducts })),
        ),
      );
      const replaceItems = (
        change: (items: readonly MerchantProduct[]) => readonly MerchantProduct[],
      ) => {
        const catalog = store.catalog();
        if (catalog) {
          patchState(store, { catalog: { ...catalog, items: change(catalog.items) } });
        }
        const matchingProducts = store.matchingProducts();
        if (matchingProducts) {
          patchState(store, { matchingProducts: change(matchingProducts) });
        }
      };
      return {
        setSearch(search: string): void {
          patchState(store, { search });
          loadMatching();
        },
        setSort(sort: ListSort | null): void {
          patchState(store, { sort });
          loadMatching();
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
