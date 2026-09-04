import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { AppUser } from '../models/user';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';
import { UserRepository } from './user.repository';

@Injectable()
export class UserHttpRepository implements UserRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
    if (query.search) {
      params = params.set('search', query.search);
    }
    return this.httpClient.get<PagedResult<AppUser>>(`${this.apiBaseUrl}/users`, { params });
  }

  getSummary(): Observable<UserSummary> {
    return this.httpClient.get<UserSummary>(`${this.apiBaseUrl}/users/summary`);
  }
}
