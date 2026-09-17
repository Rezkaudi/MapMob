import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { NotificationRepository } from '../data/notification.repository';
import { NO_NOTIFICATION_FILTERS } from '../models/notification-filters';
import { NotificationQuery } from '../models/notification-query';
import { buildNotification } from '../testing/notification-fixture';
import { NOTIFICATIONS_PAGE_SIZE, NotificationsStore } from './notifications.store';

const SCHEDULED = buildNotification();
const SUMMARY = { totalCount: 248, sentCount: 150, scheduledCount: 10, draftCount: 20 };
const TODAY = new Date(2026, 8, 8, 9, 0);

function createStore(overrides: Partial<NotificationRepository> = {}) {
  const requestedQueries: NotificationQuery[] = [];
  const writes: string[] = [];
  const recordWrite = <T>(write: string): Observable<T> => {
    writes.push(write);
    return of({} as T);
  };
  const repository: Partial<NotificationRepository> = {
    getNotifications: (query) => {
      requestedQueries.push(query);
      return of({ items: [SCHEDULED], totalCount: 1 });
    },
    getSummary: () => of(SUMMARY),
    deleteNotification: (id) => recordWrite(`delete ${id}`),
    duplicateNotification: (id) => recordWrite(`duplicate ${id}`),
    rescheduleNotification: (id, sendAt) => recordWrite(`reschedule ${id} ${sendAt}`),
    resendNotification: (id, sendAt) => recordWrite(`resend ${id} ${sendAt}`),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: NotificationRepository, useValue: repository },
      { provide: CLOCK, useValue: () => TODAY },
    ],
  });
  return { store: TestBed.inject(NotificationsStore), requestedQueries, writes };
}

describe('NotificationsStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(NOTIFICATIONS_PAGE_SIZE);
    expect(NOTIFICATIONS_PAGE_SIZE).toBe(4);
  });

  it('loads a page and the summary, then builds the rows and the stat cards', () => {
    const { store } = createStore();

    store.loadNotifications();
    store.loadSummary();

    expect(store.rows().map((row) => row.recipientLabel)).toEqual(['جميع المستخدمين']);
    expect(store.totalCount()).toBe(1);
    expect(store.statCards().map((card) => card.value)).toEqual(['248', '150', '10', '20']);
    expect(store.isSummaryLoading()).toBe(false);
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getNotifications: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadNotifications();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('swaps the page for the empty message only when nothing exists and nothing is filtered', () => {
    const { store } = createStore({ getNotifications: () => of({ items: [], totalCount: 0 }) });

    store.loadNotifications();
    expect(store.hasNoNotifications()).toBe(true);

    store.applyFilters({ ...NO_NOTIFICATION_FILTERS, status: 'sent' });
    expect(store.hasNoNotifications()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('turns the applied filters into the query, from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(2);

    store.applyFilters({
      audience: 'users',
      kind: 'general',
      status: 'scheduled',
      sendPeriod: 'last7Days',
      customRange: { from: null, to: null },
    });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      audience: 'users',
      kind: 'general',
      status: 'scheduled',
      sentFrom: '2026-09-02',
      sentTo: '2026-09-08',
    });
    expect(store.activeFilterCount()).toBe(4);
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();

    store.setSearch(' عروض ');
    store.setSort('oldest');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: 'عروض',
      sort: 'oldest',
    });
  });

  it('deletes, copies, reschedules and resends, then reloads the page', async () => {
    const { store, requestedQueries, writes } = createStore();

    expect(await store.deleteNotification('n1')).toBe(true);
    expect(await store.duplicateNotification('n1')).toBe(true);
    expect(await store.rescheduleNotification('n1', '2026-09-18T16:30')).toBe(true);
    expect(await store.resendNotification('n1', null)).toBe(true);

    expect(writes).toEqual([
      'delete n1',
      'duplicate n1',
      'reschedule n1 2026-09-18T16:30',
      'resend n1 null',
    ]);
    expect(requestedQueries).toHaveLength(4);
  });

  it('keeps the reason a write failed', async () => {
    const { store } = createStore({
      deleteNotification: () => throwError(() => new Error('تعذر الحذف')),
    });

    expect(await store.deleteNotification('n1')).toBe(false);
    expect(store.saveError()).toBe('تعذر الحذف');
  });
});
