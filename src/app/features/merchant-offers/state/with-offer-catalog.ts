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
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { ListSort } from '../../../shared/models/list-sort';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSelection } from '../../../shared/state/with-selection';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { MerchantOfferFilters, NO_MERCHANT_OFFER_FILTERS } from '../models/merchant-offer-filters';
import { countMerchantOfferFilters } from './count-merchant-offer-filters';
import { filterMerchantOffers } from './filter-merchant-offers';
import { merchantOfferQueryOf } from './merchant-offer-query-of';
import { toMerchantOfferRow } from './merchant-offer-rows';
import { countOffers } from './offer-count-tiles';
import { describeOfferQuota } from './offer-quota';

const NO_OFFERS_MESSAGE = 'لم تضف أي عرض بعد';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface OfferCatalogState {
  readonly catalog: MerchantOfferCatalog | null;
  /** What the server matched for the search and filters; `null` until one is picked. */
  readonly matchingOffers: readonly MerchantOffer[] | null;
  readonly search: string;
  readonly sort: ListSort | null;
  readonly filters: MerchantOfferFilters;
}

const initialState: OfferCatalogState = {
  catalog: null,
  matchingOffers: null,
  search: '',
  sort: null,
  filters: NO_MERCHANT_OFFER_FILTERS,
};

/** The loaded offers and what the page derives from them: rows, tiles and the plan quota. */
export function withOfferCatalog() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withSelection(),
    withComputed(
      (
        { catalog, matchingOffers, search, sort, filters, selectedIdSet },
        clock = inject(CLOCK),
      ) => {
        const offers = computed(() => catalog()?.items ?? []);
        // The server ignores the filters today, so its answer is filtered here too.
        const visibleOffers = computed(() =>
          filterMerchantOffers(matchingOffers() ?? offers(), {
            search: search(),
            sort: sort(),
            filters: filters(),
            today: toCalendarDay(clock()),
          }),
        );
        return {
          offers,
          rows: computed(() => visibleOffers().map(toMerchantOfferRow)),
          countTiles: computed(() => countOffers(offers())),
          planName: computed(() => catalog()?.plan.name ?? ''),
          quota: computed(() => {
            const loaded = catalog();
            return loaded ? describeOfferQuota(loaded.items, loaded.activeOfferLimit) : null;
          }),
          activeFilterCount: computed(() => countMerchantOfferFilters(filters())),
          hasNoRows: computed(() => catalog() !== null && visibleOffers().length === 0),
          emptyMessage: computed(() => (offers().length ? NO_MATCHES_MESSAGE : NO_OFFERS_MESSAGE)),
          areAllVisibleSelected: computed(
            () =>
              visibleOffers().length > 0 &&
              visibleOffers().every((offer) => selectedIdSet().has(offer.id)),
          ),
        };
      },
    ),
    withMethods((store, repository = inject(MerchantOfferRepository), clock = inject(CLOCK)) => {
      // A failed read keeps the full list, which the page filters on its own.
      const loadMatching = rxMethod<void>(
        pipe(
          switchMap(() =>
            repository
              .getOffers(
                merchantOfferQueryOf(store.search(), store.sort(), store.filters(), clock()),
              )
              .pipe(catchError(() => of(null))),
          ),
          tap((matchingOffers) => patchState(store, { matchingOffers })),
        ),
      );
      const replaceItems = (
        change: (items: readonly MerchantOffer[]) => readonly MerchantOffer[],
      ) => {
        const catalog = store.catalog();
        if (catalog) {
          patchState(store, { catalog: { ...catalog, items: change(catalog.items) } });
        }
        const matchingOffers = store.matchingOffers();
        if (matchingOffers) {
          patchState(store, { matchingOffers: change(matchingOffers) });
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
        applyFilters(filters: MerchantOfferFilters): void {
          patchState(store, { filters });
          loadMatching();
        },
        toggleAllVisible(): void {
          if (store.areAllVisibleSelected()) {
            store.clearSelection();
            return;
          }
          store.selectAll(store.rows().map((row) => row.offer.id));
        },
        replaceInCatalog(offer: MerchantOffer): void {
          replaceItems((items) => items.map((item) => (item.id === offer.id ? offer : item)));
        },
        removeFromCatalog(id: string): void {
          replaceItems((items) => items.filter((item) => item.id !== id));
          store.keepOnlySelected(store.offers().map((offer) => offer.id));
        },
      };
    }),
  );
}
