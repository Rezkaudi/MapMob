import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
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
import { toUserFilterParams, toUserQueryParams } from './user-query-params';
import { UserRepository } from './user.repository';

const NO_USERS: PagedResult<AppUser> = { items: [], totalCount: 0 };

@Injectable()
export class UserHttpRepository implements UserRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly usersUrl = `${inject(API_BASE_URL)}/admin/users`;

  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    if (query.accountType === 'visitor') {
      return of(NO_USERS);
    }
    return this.getPage(query).pipe(
      map((page) => ({ items: page.data.map(toAppUser), totalCount: page.meta.totalCount })),
    );
  }

  getSummary(): Observable<UserSummary> {
    return this.httpClient
      .get<LiveEnvelope<UserSummary>>(`${this.usersUrl}/summary`)
      .pipe(map(({ data }) => data));
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
