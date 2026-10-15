import { Observable } from 'rxjs';
import { AdminRole } from '../models/admin-role';
import { RoleDraft } from '../models/role-draft';

export abstract class RolesRepository {
  /** Whether a role's status, description and permissions are saved, or only its name. */
  abstract readonly savesRoleDetails: boolean;
  abstract getRoles(): Observable<readonly AdminRole[]>;
  abstract addRole(draft: RoleDraft): Observable<AdminRole>;
  abstract updateRole(id: string, draft: RoleDraft): Observable<AdminRole>;
  abstract deleteRole(id: string): Observable<void>;
}
