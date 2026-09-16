import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentRepository } from '../data/payment.repository';
import { PaymentQuery } from '../models/payment-query';
import { NO_PAYMENT_FILTERS } from '../models/payment-filters';
import { buildPaymentDetail } from '../testing/payment-fixture';
import { PAYMENTS_PAGE_SIZE, PaymentsStore } from './payments.store';

const PHARMACY = buildPaymentDetail();
const SUMMARY = { pendingCount: 20, transactionCount: 400, monthTotal: 200, cumulativeTotal: 1200 };

function createStore(overrides: Partial<PaymentRepository> = {}) {
  const requestedQueries: PaymentQuery[] = [];
  const repository: Partial<PaymentRepository> = {
    getPayments: (query) => {
      requestedQueries.push(query);
      return of({ items: [PHARMACY], totalCount: 1 });
    },
    getSummary: () => of(SUMMARY),
    exportPayments: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [{ provide: PaymentRepository, useValue: repository }],
  });
  return { store: TestBed.inject(PaymentsStore), requestedQueries };
}

describe('PaymentsStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(PAYMENTS_PAGE_SIZE);
    expect(PAYMENTS_PAGE_SIZE).toBe(4);
  });

  it('loads a page of payments and the summary, then builds the stat cards', () => {
    const { store } = createStore();

    store.loadPayments();
    store.loadSummary();

    expect(store.entries()).toEqual([PHARMACY]);
    expect(store.totalCount()).toBe(1);
    expect(store.statCards().map((card) => card.value)).toEqual(['$1200', '200$', '400', '20']);
  });

  it('reports a failed load without blocking the summary', () => {
    const { store } = createStore({
      getPayments: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadPayments();
    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the applied filters into the query and starts again from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(2);

    store.applyFilters({
      ...NO_PAYMENT_FILTERS,
      companyName: 'الحياة',
      paymentMethod: 'cash',
      currency: 'USD',
      paidOn: { from: '2026-08-01', to: null },
    });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      companyName: 'الحياة',
      paymentMethod: 'cash',
      currency: 'USD',
      paidOn: { from: '2026-08-01', to: null },
    });
    expect(store.activeFilterCount()).toBe(4);
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();

    store.setSearch(' الحياة ');
    store.setSort('name');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: 'الحياة',
      sort: 'name',
    });
  });

  it('exports with the current query, or reports why it could not', async () => {
    const { store } = createStore();
    expect(await store.exportPayments()).toBeInstanceOf(Blob);

    TestBed.resetTestingModule();
    const failing = createStore({
      exportPayments: () => throwError(() => new Error('تعذر التصدير')),
    });
    expect(await failing.store.exportPayments()).toBeNull();
    expect(failing.store.saveError()).toBe('تعذر التصدير');
  });
});
