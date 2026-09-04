import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of, forkJoin } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withPagination } from '../../../shared/state/with-pagination';
import { UserRepository } from '../data/user.repository';
import { AppUser } from '../models/user';
import { UserSummary } from '../models/user-summary';

interface UsersState {
  readonly users: readonly AppUser[];
  readonly search: string;
  readonly summary: UserSummary | null;
}

const initialState: UsersState = {
  users: [],
  search: '',
  summary: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withPagination(),
  withMethods((store, repository = inject(UserRepository)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            page: repository.getUsers({
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.search() || undefined,
            }),
            summary: repository.getSummary(),
          }).pipe(
            tap(({ page, summary }) => {
              patchState(store, { users: page.items, summary });
              store.setTotalCount(page.totalCount);
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
  withMethods((store) => ({
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.loadUsers();
    },
    setSearch(search: string): void {
      patchState(store, { search });
      store.goToPage(0);
      store.loadUsers();
    },
  })),
);
