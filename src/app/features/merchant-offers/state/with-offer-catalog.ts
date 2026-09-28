import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CLOCK } from '../../../core/config/clock';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { ListSort } from '../../../shared/models/list-sort';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSelection } from '../../../shared/state/with-selection';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { MerchantOfferFilters, NO_MERCHANT_OFFER_FILTERS } from '../models/merchant-offer-filters';
import { countMerchantOfferFilters } from './count-merchant-offer-filters';
import { filterMerchantOffers } from './filter-merchant-offers';
import { toMerchantOfferRow } from './merchant-offer-rows';
import { countOffers } from './offer-count-tiles';
import { describeOfferQuota } from './offer-quota';

const NO_OFFERS_MESSAGE = 'لم تضف أي عرض بعد';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface OfferCatalogState {
  readonly catalog: MerchantOfferCatalog | null;
  readonly search: string;
  readonly sort: ListSort | null;
  readonly filters: MerchantOfferFilters;
}

const initialState: OfferCatalogState = {
  catalog: null,
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
    withComputed(({ catalog, search, sort, filters, selectedIdSet }, clock = inject(CLOCK)) => {
      const offers = computed(() => catalog()?.items ?? []);
      const visibleOffers = computed(() =>
        filterMerchantOffers(offers(), {
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
    }),
    withMethods((store) => {
      const replaceItems = (
        change: (items: readonly MerchantOffer[]) => readonly MerchantOffer[],
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
        applyFilters(filters: MerchantOfferFilters): void {
          patchState(store, { filters });
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
