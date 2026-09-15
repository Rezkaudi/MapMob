import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { UserRepository } from '../data/user.repository';
import { AppUser } from '../models/user';
import { NO_USER_FILTERS, UserFilters } from '../models/user-filters';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';
import { countActiveFilters } from './count-active-filters';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { buildUserStatCards } from './user-stat-cards';

/** The users design draws six rows per page. */
export const USERS_PAGE_SIZE = 6;

const NO_USERS_MESSAGE = 'لا يوجد مستخدمون لعرضهم';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface UsersState {
  readonly filters: UserFilters;
  readonly summary: UserSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: UsersState = {
  filters: NO_USER_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<AppUser>({ pageSize: USERS_PAGE_SIZE }),
  withComputed(({ filters, search, summary, hasSummaryFailed }) => {
    const activeFilterCount = computed(() => countActiveFilters(filters()));
    return {
      activeFilterCount,
      statCards: computed(() => buildUserStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_USERS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(UserRepository), clock = inject(CLOCK)) => {
    const currentUserQuery = (): UserQuery => {
      const { accountType, status, registrationPeriod, customRange } = store.filters();
      const { from, to } = resolveDatePeriodRange(registrationPeriod, customRange, clock());
      return {
        ...store.currentQuery(),
        ...(accountType ? { accountType } : {}),
        ...(status ? { status } : {}),
        ...(from ? { registeredFrom: from } : {}),
        ...(to ? { registeredTo: to } : {}),
      };
    };

    return {
      currentUserQuery,
      loadUsers: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getUsers(currentUserQuery()).pipe(
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
  withMethods((store, repository = inject(UserRepository)) => {
    const reloadAll = () => {
      store.loadUsers();
      store.loadSummary();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadUsers();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadUsers();
      },
      applyFilters(filters: UserFilters): void {
        patchState(store, { filters });
        store.resetToFirstPage();
        store.loadUsers();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadUsers();
      },
      changeStatus(id: string, status: ActivationStatus): Promise<boolean> {
        return saveThenReload(repository.setUserStatus(id, status));
      },
      deleteUser(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteUser(id), () => store.forgetRemovedEntry(id));
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportUsers(): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          return await lastValueFrom(repository.exportUsers(store.currentUserQuery()));
        } catch (error) {
          patchState(store, { saveError: (error as Error).message });
          return null;
        } finally {
          patchState(store, { isExporting: false });
        }
      },
    };
  }),
);
