import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminRole } from '../models/admin-role';
import { RoleDraft } from '../models/role-draft';
import { RolesRepository } from './roles.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class RolesMockRepository implements RolesRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getRoles(): Observable<readonly AdminRole[]> {
    return this.loader.request((database) => database.team.roles());
  }

  addRole(draft: RoleDraft): Observable<AdminRole> {
    return this.loader.request((database) => database.team.addRole(draft));
  }

  updateRole(id: string, draft: RoleDraft): Observable<AdminRole> {
    return this.loader.request((database) => database.team.updateRole(id, draft));
  }

  deleteRole(id: string): Observable<void> {
    return this.loader.request((database) => database.team.deleteRole(id));
  }
}
