import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';
import { LiveUser } from './live-user';
import { toAppUser, toUserDetail } from './live-user-mapping';
import { LiveUserPage } from './live-user-page';
import { toUserSummary } from './live-user-summary';
import { toUserFilterParams, toUserQueryParams } from './user-query-params';
import { UserRepository } from './user.repository';

const NO_USERS: PagedResult<AppUser> = { items: [], totalCount: 0 };
const FIRST_PAGE = { pageIndex: 0 };
/** How many of the newest users the summary reads to count the new ones. */
const NEWEST_USERS_PAGE_SIZE = 100;

@Injectable()
export class UserHttpRepository implements UserRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly usersUrl = `${inject(API_BASE_URL)}/admin/users`;

  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    if (query.accountType === 'visitor') {
      return of(NO_USERS);
    }
    return this.getPage(query).pipe(
      map((page) => ({ items: page.data.map(toAppUser), totalCount: page.meta.totalCount })),
    );
  }

  // The server has no summary route yet, so the cards are counted from the list.
  getSummary(): Observable<UserSummary> {
    return forkJoin({
      newest: this.getPage({ ...FIRST_PAGE, pageSize: NEWEST_USERS_PAGE_SIZE }),
      suspended: this.getPage({ ...FIRST_PAGE, pageSize: 1, status: 'suspended' }),
    }).pipe(
      map(({ newest, suspended }) =>
        toUserSummary(
          {
            totalCount: newest.meta.totalCount,
            suspendedCount: suspended.meta.totalCount,
            newestSignUps: newest.data.map((user) => user.created_at),
          },
          this.clock(),
        ),
      ),
    );
  }

  getUserDetail(id: string): Observable<UserDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveUser>>(`${this.usersUrl}/${id}`)
      .pipe(map(({ data }) => toUserDetail(data)));
  }

  setUserStatus(id: string, status: ActivationStatus): Observable<AppUser> {
    return this.httpClient
      .patch<LiveEnvelope<LiveUser>>(`${this.usersUrl}/${id}/status`, { status })
      .pipe(map(({ data }) => toAppUser(data)));
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete(`${this.usersUrl}/${id}`).pipe(map(() => undefined));
  }

  exportUsers(query: UserQuery): Observable<Blob> {
    return this.httpClient.get(`${this.usersUrl}/export`, {
      params: toUserFilterParams(query),
      responseType: 'blob',
    });
  }

  private getPage(query: UserQuery): Observable<LiveUserPage> {
    return this.httpClient.get<LiveUserPage>(this.usersUrl, { params: toUserQueryParams(query) });
  }
}
