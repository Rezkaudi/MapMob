import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { SubscriptionRepository } from '../data/subscription.repository';
import { Subscription } from '../models/subscription';
import {
  NO_SUBSCRIPTION_FILTERS,
  SubscriptionFilters,
} from '../models/subscription-filters';
import { SubscriptionQuery } from '../models/subscription-query';
import { countActiveSubscriptionFilters } from './count-active-subscription-filters';

/** The subscriptions design draws four rows per page. */
export const SUBSCRIPTIONS_PAGE_SIZE = 4;

const NO_SUBSCRIPTIONS_MESSAGE = 'لا توجد اشتراكات لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface SubscriptionsState {
  readonly filters: SubscriptionFilters;
  readonly isExporting: boolean;
}

const initialState: SubscriptionsState = {
  filters: NO_SUBSCRIPTION_FILTERS,
  isExporting: false,
};

export const SubscriptionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Subscription>({ pageSize: SUBSCRIPTIONS_PAGE_SIZE }),
  withComputed(({ filters, search, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveSubscriptionFilters(filters()));
    return {
      activeFilterCount,
      /** Nothing subscribed at all: the tab swaps the toolbar and table for one message. */
      hasNoSubscriptions: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_SUBSCRIPTIONS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(SubscriptionRepository)) => {
    const currentSubscriptionQuery = (): SubscriptionQuery => {
      const { tier, status, subscribedRange } = store.filters();
      return {
        ...store.currentQuery(),
        ...(tier ? { tier } : {}),
        ...(status ? { status } : {}),
        ...(subscribedRange.from ? { subscribedFrom: subscribedRange.from } : {}),
        ...(subscribedRange.to ? { subscribedTo: subscribedRange.to } : {}),
      };
    };

    return {
      currentSubscriptionQuery,
      loadSubscriptions: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getSubscriptions(currentSubscriptionQuery()).pipe(
              tap((page) => store.showPage(page)),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(SubscriptionRepository)) => ({
    setSearch(search: string): void {
      store.applyQuery({ search });
      store.loadSubscriptions();
    },
    setSort(sort: ListSort | null): void {
      store.applyQuery({ sort });
      store.loadSubscriptions();
    },
    applyFilters(filters: SubscriptionFilters): void {
      patchState(store, { filters });
      store.resetToFirstPage();
      store.loadSubscriptions();
    },
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.clearSelection();
      store.loadSubscriptions();
    },
    /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
    async exportSubscriptions(): Promise<Blob | null> {
      patchState(store, { isExporting: true, saveError: null });
      try {
        return await lastValueFrom(repository.exportSubscriptions(store.currentSubscriptionQuery()));
      } catch (error) {
        patchState(store, { saveError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isExporting: false });
      }
    },
  })),
);
