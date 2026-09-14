import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { AppUser } from '../models/user';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';

const NEW_USER_DAYS = 30;
const DAY_MS = 86_400_000;

export function filterUsers(users: readonly AppUser[], query: UserQuery): readonly AppUser[] {
  const matching = users.filter((user) => matchesFilters(user, query));
  return sortListEntries(matching, query.sort, (user) => user.registeredAt);
}

export function queryUsers(users: readonly AppUser[], query: UserQuery): PagedResult<AppUser> {
  return paginate(filterUsers(users, query), query.pageIndex, query.pageSize);
}

export function summarizeUsers(users: readonly AppUser[], now: Date): UserSummary {
  const activeUserCount = users.filter((user) => user.status === 'active').length;
  const newSince = now.getTime() - NEW_USER_DAYS * DAY_MS;
  return {
    totalUserCount: users.length,
    activeUserCount,
    suspendedUserCount: users.length - activeUserCount,
    newUserCount: users.filter((user) => new Date(user.registeredAt).getTime() >= newSince).length,
  };
}

function matchesSearch(user: AppUser, search: string | undefined): boolean {
  const term = search?.trim().toLowerCase();
  if (!term) {
    return true;
  }
  return [user.name, user.email, user.phone].some((field) => field?.toLowerCase().includes(term));
}

function matchesRegistration(user: AppUser, query: UserQuery): boolean {
  const registeredDay = toCalendarDay(new Date(user.registeredAt));
  if (query.registeredFrom && registeredDay < query.registeredFrom) {
    return false;
  }
  return !query.registeredTo || registeredDay <= query.registeredTo;
}

function matchesFilters(user: AppUser, query: UserQuery): boolean {
  if (query.accountType && user.accountType !== query.accountType) {
    return false;
  }
  if (query.status && user.status !== query.status) {
    return false;
  }
  return matchesSearch(user, query.search) && matchesRegistration(user, query);
}
