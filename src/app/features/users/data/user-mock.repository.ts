import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { PagedResult } from '../../../core/models/paged-result';
import { CLOCK } from '../../../core/config/clock';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';
import { UserMockDatabase } from './user-mock-database';
import { buildMockUserDetail } from './user-mock-detail';
import { filterUsers, queryUsers, summarizeUsers } from './user-mock-query';
import { UserRepository } from './user.repository';
import { buildUsersCsv } from './users-csv';

/** The byte-order mark lets spreadsheet apps read the Arabic text as UTF-8. */
const CSV_BYTE_ORDER_MARK = '\uFEFF';
const CSV_TYPE = 'text/csv;charset=utf-8';

@Injectable()
export class UserMockRepository implements UserRepository {
  private readonly database = inject(UserMockDatabase);
  private readonly clock = inject(CLOCK);

  getUsers(query: UserQuery): Observable<PagedResult<AppUser>> {
    return mockRequest(() => queryUsers(this.database.list(), query));
  }

  getSummary(): Observable<UserSummary> {
    return mockRequest(() => summarizeUsers(this.database.list(), this.clock()));
  }

  getUserDetail(id: string): Observable<UserDetail> {
    return mockRequest(() => buildMockUserDetail(this.database.find(id), this.clock()));
  }

  setUserStatus(id: string, status: ActivationStatus): Observable<AppUser> {
    return mockRequest(() => this.database.setStatus(id, status));
  }

  deleteUser(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  exportUsers(query: UserQuery): Observable<Blob> {
    return mockRequest(() => {
      const csv = buildUsersCsv(filterUsers(this.database.list(), query));
      return new Blob([CSV_BYTE_ORDER_MARK, csv], { type: CSV_TYPE });
    });
  }
}
