import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AdminRole } from '../models/admin-role';
import { RoleDraft } from '../models/role-draft';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesHttpRepository implements RolesRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get rolesUrl(): string {
    return `${this.apiBaseUrl}/settings/roles`;
  }

  getRoles(): Observable<readonly AdminRole[]> {
    return this.httpClient.get<readonly AdminRole[]>(this.rolesUrl);
  }

  addRole(draft: RoleDraft): Observable<AdminRole> {
    return this.httpClient.post<AdminRole>(this.rolesUrl, draft);
  }

  updateRole(id: string, draft: RoleDraft): Observable<AdminRole> {
    return this.httpClient.put<AdminRole>(`${this.rolesUrl}/${id}`, draft);
  }

  deleteRole(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.rolesUrl}/${id}`);
  }
}
