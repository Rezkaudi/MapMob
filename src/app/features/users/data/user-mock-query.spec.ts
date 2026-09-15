import { buildUser } from '../testing/user-fixture';
import { queryUsers, summarizeUsers } from './user-mock-query';

const NOW = new Date(2026, 8, 15, 12, 0);
const AHMAD = buildUser({
  id: 'u1',
  name: 'أحمد جمال',
  registeredAt: new Date(2026, 8, 10).toISOString(),
});
const SARA = buildUser({
  id: 'u2',
  name: 'سارة محمود',
  email: 'sara@email.com',
  accountType: 'visitor',
  status: 'suspended',
  registeredAt: new Date(2026, 7, 1).toISOString(),
});
const KHALED = buildUser({
  id: 'u3',
  name: 'خالد إبراهيم',
  registeredAt: new Date(2025, 0, 5).toISOString(),
});
const USERS = [AHMAD, SARA, KHALED];

describe('queryUsers', () => {
  it('pages the users', () => {
    const page = queryUsers(USERS, { pageIndex: 1, pageSize: 2 });

    expect(page).toEqual({ items: [KHALED], totalCount: 3 });
  });

  it('searches the name, email and phone', () => {
    expect(queryUsers(USERS, { pageIndex: 0, pageSize: 6, search: 'سارة' }).items).toEqual([SARA]);
    expect(queryUsers(USERS, { pageIndex: 0, pageSize: 6, search: 'sara@' }).items).toEqual([SARA]);
  });

  it('filters by account type, status and registration days', () => {
    const base = { pageIndex: 0, pageSize: 6 };

    expect(queryUsers(USERS, { ...base, accountType: 'visitor' }).items).toEqual([SARA]);
    expect(queryUsers(USERS, { ...base, status: 'active' }).items).toEqual([AHMAD, KHALED]);
    expect(
      queryUsers(USERS, { ...base, registeredFrom: '2026-08-01', registeredTo: '2026-09-10' })
        .items,
    ).toEqual([AHMAD, SARA]);
  });

  it('sorts newest first by registration date', () => {
    expect(queryUsers(USERS, { pageIndex: 0, pageSize: 6, sort: 'newest' }).items).toEqual([
      AHMAD,
      SARA,
      KHALED,
    ]);
  });
});

describe('summarizeUsers', () => {
  it('counts everyone, the active and suspended, and who joined in the last 30 days', () => {
    expect(summarizeUsers(USERS, NOW)).toEqual({
      totalUserCount: 3,
      activeUserCount: 2,
      suspendedUserCount: 1,
      newUserCount: 1,
    });
  });
});
