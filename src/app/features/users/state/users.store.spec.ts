import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { UserRepository } from '../data/user.repository';
import { NO_USER_FILTERS } from '../models/user-filters';
import { UserQuery } from '../models/user-query';
import { buildUser } from '../testing/user-fixture';
import { USERS_PAGE_SIZE, UsersStore } from './users.store';

const AHMAD = buildUser();
const SUMMARY = {
  totalUserCount: 3000,
  activeUserCount: 2673,
  suspendedUserCount: 427,
  newUserCount: 340,
};
const TODAY = new Date(2026, 8, 15, 10, 0);

function createStore(overrides: Partial<UserRepository> = {}) {
  const requestedQueries: UserQuery[] = [];
  const repository: Partial<UserRepository> = {
    getUsers: (query) => {
      requestedQueries.push(query);
      return of({ items: [AHMAD], totalCount: 1 });
    },
    getSummary: () => of(SUMMARY),
    setUserStatus: () => of(buildUser({ status: 'suspended' })),
    deleteUser: () => of(undefined),
    exportUsers: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: UserRepository, useValue: repository },
      { provide: CLOCK, useValue: () => TODAY },
    ],
  });
  return { store: TestBed.inject(UsersStore), requestedQueries };
}

describe('UsersStore', () => {
  it('draws six rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(USERS_PAGE_SIZE);
    expect(USERS_PAGE_SIZE).toBe(6);
  });

  it('loads a page of users and the summary', () => {
    const { store } = createStore();

    store.loadUsers();
    store.loadSummary();

    expect(store.entries()).toEqual([AHMAD]);
    expect(store.totalCount()).toBe(1);
    expect(store.summary()).toEqual(SUMMARY);
    expect(store.isSummaryLoading()).toBe(false);
  });

  it('falls back to the last page when a reload leaves the current one empty', () => {
    // Enough rows for three pages, then a reload that only fills one.
    let isShrunk = false;
    const { store } = createStore({
      getUsers: (query) => {
        if (!isShrunk) {
          return of({ items: [AHMAD], totalCount: USERS_PAGE_SIZE * 3 });
        }
        return of(
          query.pageIndex === 0 ? { items: [AHMAD], totalCount: 1 } : { items: [], totalCount: 1 },
        );
      },
    });

    store.loadUsers();
    store.changePage(2);
    isShrunk = true;
    store.loadUsers();

    expect(store.pageIndex()).toBe(0);
    expect(store.entries()).toEqual([AHMAD]);
    expect(store.isLoading()).toBe(false);
  });

  it('drops the ticks of rows a reload no longer returns', () => {
    const other = buildUser({ id: 'user-2' });
    let isTrimmed = false;
    const { store } = createStore({
      getUsers: () =>
        of(
          isTrimmed ? { items: [AHMAD], totalCount: 1 } : { items: [AHMAD, other], totalCount: 2 },
        ),
    });

    store.loadUsers();
    store.toggleAllVisible();
    isTrimmed = true;
    store.loadUsers();

    expect(store.selectedIds()).toEqual([AHMAD.id]);
  });

  it('builds the four stat cards in the design order and number style', () => {
    const { store } = createStore();

    store.loadSummary();

    expect(store.statCards()).toEqual([
      { label: 'إجمالي المستخدمين', value: '3,000', icon: 'users' },
      { label: 'المستخدمون النشطون', value: '2,673', icon: 'users' },
      { label: 'المستخدمون الموقوفون', value: '427', icon: 'users' },
      { label: 'المستخدمون الجدد', value: '340+', icon: 'users' },
    ]);
  });

  it('reports a failed load', () => {
    const { store } = createStore({ getUsers: () => throwError(() => new Error('تعذر التحميل')) });

    store.loadUsers();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the applied filters into the query, resolving the date preset from today', () => {
    const { store, requestedQueries } = createStore();

    store.applyFilters({
      ...NO_USER_FILTERS,
      accountType: 'registered',
      status: 'active',
      registrationPeriod: 'last7Days',
    });

    expect(store.filters().accountType).toBe('registered');
    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: USERS_PAGE_SIZE,
      accountType: 'registered',
      status: 'active',
      registeredFrom: '2026-09-09',
      registeredTo: '2026-09-15',
    });
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();

    store.setSearch('أحمد');
    store.setSort('oldest');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: USERS_PAGE_SIZE,
      search: 'أحمد',
      sort: 'oldest',
    });
  });

  it('counts the filters that differ from "الكل"', () => {
    const { store } = createStore();
    expect(store.activeFilterCount()).toBe(0);

    store.applyFilters({ ...NO_USER_FILTERS, status: 'suspended', registrationPeriod: 'today' });

    expect(store.activeFilterCount()).toBe(2);
  });

  it('tells "no users yet" apart from "nothing matches"', () => {
    const { store } = createStore({ getUsers: () => of({ items: [], totalCount: 0 }) });

    store.loadUsers();
    expect(store.emptyMessage()).toBe('لا يوجد مستخدمون لعرضهم');

    store.applyFilters({ ...NO_USER_FILTERS, status: 'suspended' });
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('changes a status, then reloads the page and the summary', async () => {
    let summaryLoads = 0;
    const { store, requestedQueries } = createStore({
      getSummary: () => {
        summaryLoads += 1;
        return of(SUMMARY);
      },
    });

    const isSaved = await store.changeStatus('user-1', 'suspended');

    expect(isSaved).toBe(true);
    expect(requestedQueries).toHaveLength(1);
    expect(summaryLoads).toBe(1);
  });

  it('keeps the error when a delete fails', async () => {
    const { store } = createStore({
      deleteUser: () => throwError(() => new Error('تعذر الحذف')) as Observable<void>,
    });

    const isSaved = await store.deleteUser('user-1');

    expect(isSaved).toBe(false);
    expect(store.saveError()).toBe('تعذر الحذف');
  });

  it('exports every user matching the current filters, not only this page', async () => {
    let exportedQuery: UserQuery | undefined;
    const file = new Blob(['csv']);
    const { store } = createStore({
      exportUsers: (query) => {
        exportedQuery = query;
        return of(file);
      },
    });
    store.applyFilters({ ...NO_USER_FILTERS, accountType: 'visitor' });

    const exported = await store.exportUsers();

    expect(exported).toBe(file);
    expect(exportedQuery?.accountType).toBe('visitor');
    expect(store.isExporting()).toBe(false);
  });

  it('gives no file and a message when the export fails', async () => {
    const { store } = createStore({
      exportUsers: () => throwError(() => new Error('تعذر التصدير')),
    });

    expect(await store.exportUsers()).toBeNull();
    expect(store.saveError()).toBe('تعذر التصدير');
  });
});
