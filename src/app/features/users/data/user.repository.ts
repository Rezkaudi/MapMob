import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';

export abstract class UserRepository {
  abstract getUsers(query: UserQuery): Observable<PagedResult<AppUser>>;
  abstract getSummary(): Observable<UserSummary>;
  abstract getUserDetail(id: string): Observable<UserDetail>;
  abstract setUserStatus(id: string, status: ActivationStatus): Observable<AppUser>;
  abstract deleteUser(id: string): Observable<void>;
  /** Every user matching the filters, not just one page. */
  abstract exportUsers(query: UserQuery): Observable<Blob>;
}
