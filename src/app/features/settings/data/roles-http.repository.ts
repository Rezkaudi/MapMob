import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AdminRole } from '../models/admin-role';
import { RoleDraft } from '../models/role-draft';
import { isAppRoleName, toAdminRole } from './live-settings-mapping';
import { LiveSettingsRole } from './live-settings-role';
import { RolesRepository } from './roles.repository';

const ROLE_NOT_FOUND_MESSAGE = 'تعذر قراءة الدور بعد حفظه.';

interface LiveSavedRole {
  readonly id: number | string;
}

/**
 * The settings list reads the roles with their counts; the writes go to `/admin/roles`,
 * which keeps only the name.
 */
@Injectable()
export class RolesHttpRepository implements RolesRepository {
  readonly savesRoleDetails = false;
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly rolesUrl = `${this.adminUrl}/roles`;

  getRoles(): Observable<readonly AdminRole[]> {
    return this.httpClient
      .get<readonly LiveSettingsRole[]>(`${this.adminUrl}/settings/roles`)
      .pipe(map((roles) => roles.filter((role) => !isAppRoleName(role.name)).map(toAdminRole)));
  }

  addRole(draft: RoleDraft): Observable<AdminRole> {
    return this.httpClient
      .post<LiveEnvelope<LiveSavedRole>>(this.rolesUrl, { name: draft.name })
      .pipe(switchMap(({ data }) => this.readRole(String(data.id))));
  }

  // PHP reads a body only on POST, so the rename names its real method inside it.
  updateRole(id: string, draft: RoleDraft): Observable<AdminRole> {
    return this.httpClient
      .post<LiveEnvelope<LiveSavedRole>>(`${this.rolesUrl}/${id}`, {
        _method: 'PUT',
        name: draft.name,
      })
      .pipe(switchMap(() => this.readRole(id)));
  }

  deleteRole(id: string): Observable<void> {
    return this.httpClient.delete(`${this.rolesUrl}/${id}`).pipe(map(() => undefined));
  }

  private readRole(id: string): Observable<AdminRole> {
    return this.getRoles().pipe(
      switchMap((roles) => {
        const role = roles.find((candidate) => candidate.id === id);
        return role ? [role] : throwError(() => new Error(ROLE_NOT_FOUND_MESSAGE));
      }),
    );
  }
}
