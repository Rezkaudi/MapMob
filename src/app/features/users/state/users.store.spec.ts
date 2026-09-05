import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserRepository } from '../data/user.repository';
import { UsersStore } from './users.store';

const USER = {
  id: 'user-1',
  name: 'أحمد جمال',
  email: 'ahmad@email.com',
  accountType: 'مسجل',
  registeredAt: '2024-01-12T00:00:00.000Z',
  lastActiveLabel: 'منذ يومين',
  status: 'active' as const,
};
const SUMMARY = {
  newUserCount: 340,
  verifiedUserCount: 427,
  activeUserCount: 2673,
  totalUserCount: 3000,
};

function createStore(repository: Partial<UserRepository>) {
  TestBed.configureTestingModule({
    providers: [UsersStore, { provide: UserRepository, useValue: repository }],
  });
  return TestBed.inject(UsersStore);
}

describe('UsersStore', () => {
  it('loads users, the total count and the summary', () => {
    const store = createStore({
      getUsers: () => of({ items: [USER], totalCount: 1 }),
      getSummary: () => of(SUMMARY),
    });

    store.loadUsers();

    expect(store.users()).toEqual([USER]);
    expect(store.totalCount()).toBe(1);
    expect(store.summary()).toEqual(SUMMARY);
  });

  it('setSearch resets to the first page and reloads', () => {
    let requestedSearch: string | undefined;
    const store = createStore({
      getUsers: (query) => {
        requestedSearch = query.search;
        return of({ items: [], totalCount: 0 });
      },
      getSummary: () => of(SUMMARY),
    });

    store.setSearch('أحمد');

    expect(requestedSearch).toBe('أحمد');
    expect(store.pageIndex()).toBe(0);
  });
  it('reports no results only once the load has finished', () => {
    const store = createStore({
      getUsers: () => of({ items: [], totalCount: 0 }),
      getSummary: () => of(SUMMARY),
    });

    store.loadUsers();

    expect(store.hasNoResults()).toBe(true);
  });
});
