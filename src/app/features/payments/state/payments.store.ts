import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { PaymentRepository } from '../data/payment.repository';
import { Payment } from '../models/payment';
import { NO_PAYMENT_FILTERS, PaymentFilters } from '../models/payment-filters';
import { PaymentQuery } from '../models/payment-query';
import { PaymentSummary } from '../models/payment-summary';
import { countActivePaymentFilters } from './count-active-payment-filters';
import { buildPaymentStatCards } from './payment-stat-cards';

/** The payments design draws four rows per page. */
export const PAYMENTS_PAGE_SIZE = 4;

const NO_PAYMENTS_MESSAGE = 'لا توجد مدفوعات لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface PaymentsState {
  readonly filters: PaymentFilters;
  readonly summary: PaymentSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: PaymentsState = {
  filters: NO_PAYMENT_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const PaymentsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Payment>({ pageSize: PAYMENTS_PAGE_SIZE }),
  withComputed(({ filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActivePaymentFilters(filters()));
    return {
      activeFilterCount,
      statCards: computed(() => buildPaymentStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing added at all: the page swaps everything below its title for the empty message. */
      hasNoPayments: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_PAYMENTS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(PaymentRepository)) => {
    const currentPaymentQuery = (): PaymentQuery => {
      const { companyName, paymentMethod, currency, paidOn } = store.filters();
      return {
        ...store.currentQuery(),
        ...(companyName.trim() ? { companyName: companyName.trim() } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
        ...(currency ? { currency } : {}),
        ...(paidOn.from || paidOn.to ? { paidOn } : {}),
      };
    };

    return {
      currentPaymentQuery,
      loadPayments: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getPayments(currentPaymentQuery()).pipe(
              tap((page) => store.showPage(page)),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      loadSummary: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, hasSummaryFailed: false })),
              catchError(() => {
                patchState(store, { hasSummaryFailed: true });
                return of(null);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(PaymentRepository)) => ({
    setSearch(search: string): void {
      store.applyQuery({ search });
      store.loadPayments();
    },
    setSort(sort: ListSort | null): void {
      store.applyQuery({ sort });
      store.loadPayments();
    },
    applyFilters(filters: PaymentFilters): void {
      patchState(store, { filters });
      store.resetToFirstPage();
      store.loadPayments();
    },
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.clearSelection();
      store.loadPayments();
    },
    /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
    async exportPayments(): Promise<Blob | null> {
      patchState(store, { isExporting: true, saveError: null });
      try {
        return await lastValueFrom(repository.exportPayments(store.currentPaymentQuery()));
      } catch (error) {
        patchState(store, { saveError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isExporting: false });
      }
    },
  })),
);
