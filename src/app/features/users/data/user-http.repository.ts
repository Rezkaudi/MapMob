import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';
import { toUserQueryParams } from './user-query-params';
import { UserRepository } from './user.repository';

@Injectable()
export class UserHttpRepository implements UserRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly usersUrl = `${inject(API_BASE_URL)}/users`;

  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    return this.httpClient.get<PagedResult<AppUser>>(this.usersUrl, {
      params: toUserQueryParams(query),
    });
  }

  getSummary(): Observable<UserSummary> {
    return this.httpClient.get<UserSummary>(`${this.usersUrl}/summary`);
  }

  getUserDetail(id: string): Observable<UserDetail> {
    return this.httpClient.get<UserDetail>(`${this.usersUrl}/${id}`);
  }

  setUserStatus(id: string, status: ActivationStatus): Observable<AppUser> {
    return this.httpClient.patch<AppUser>(`${this.usersUrl}/${id}/status`, { status });
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.usersUrl}/${id}`);
  }

  exportUsers(query: UserQuery): Observable<Blob> {
    return this.httpClient.get(`${this.usersUrl}/export`, {
      params: toUserQueryParams(query),
      responseType: 'blob',
    });
  }
}
