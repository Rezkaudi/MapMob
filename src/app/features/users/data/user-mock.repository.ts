import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockResponse } from '../../../../mock/mock-delay';
import { paginate } from '../../../../mock/paginate';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { AppUser } from '../models/user';
import { UserQuery } from '../models/user-query';
import { UserStatus } from '../models/user-status';
import { UserSummary } from '../models/user-summary';
import { UserRepository } from './user.repository';

const TOTAL_USER_COUNT = 3000;
const NAMES = ['أحمد جمال', 'سارة محمود', 'خالد إبراهيم', 'منى عبد الله', 'يوسف علي', 'هدى سالم'];
const ACCOUNT_TYPES = ['مسجل', 'ضيف', 'شريك'];
const STATUSES: readonly UserStatus[] = ['active', 'active', 'active', 'inactive'];
const LAST_ACTIVE_LABELS = ['منذ يومين', 'منذ ساعة', 'منذ أسبوع', 'الآن'];

function buildUser(index: number): AppUser {
  const next = createSeededRandom(index + 1);
  const name = pickOne(next, NAMES);
  return {
    id: `user-${index + 1}`,
    name,
    email: 'ahmad@email.com',
    accountType: pickOne(next, ACCOUNT_TYPES),
    registeredAt: new Date(2024, 0, randomInt(next, 1, 28)).toISOString(),
    lastActiveLabel: pickOne(next, LAST_ACTIVE_LABELS),
    status: pickOne(next, STATUSES),
  };
}

const ALL_USERS: readonly AppUser[] = Array.from({ length: TOTAL_USER_COUNT }, (_, i) =>
  buildUser(i),
);

@Injectable()
export class UserMockRepository implements UserRepository {
  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    const filtered = ALL_USERS.filter((user) => !query.search || user.name.includes(query.search));
    return mockResponse(paginate(filtered, query.pageIndex, query.pageSize));
  }

  getSummary(): Observable<UserSummary> {
    return mockResponse({
      newUserCount: 340,
      verifiedUserCount: 427,
      activeUserCount: 2673,
      totalUserCount: TOTAL_USER_COUNT,
    });
  }
}
