import { Observable } from 'rxjs';
import { AdminRole } from '../models/admin-role';
import { RoleDraft } from '../models/role-draft';

export abstract class RolesRepository {
  abstract getRoles(): Observable<readonly AdminRole[]>;
  abstract addRole(draft: RoleDraft): Observable<AdminRole>;
  abstract updateRole(id: string, draft: RoleDraft): Observable<AdminRole>;
  abstract deleteRole(id: string): Observable<void>;
}
