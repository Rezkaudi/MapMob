import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { AppUser } from '../models/user';
import { UserQuery } from '../models/user-query';
import { UserSummary } from '../models/user-summary';

export abstract class UserRepository {
  abstract getUsers(query: UserQuery): Observable<PagedResult<AppUser>>;
  abstract getSummary(): Observable<UserSummary>;
}
