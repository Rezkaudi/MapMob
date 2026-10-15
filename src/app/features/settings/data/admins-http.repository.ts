import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AdminInvitation } from '../models/admin-invitation';
import { DashboardAdmin } from '../models/dashboard-admin';
import { AdminsRepository } from './admins.repository';
import { isAppRoleName, toDashboardAdmin } from './live-settings-mapping';
import { LiveTeamMember } from './live-team-member';

@Injectable()
export class AdminsHttpRepository implements AdminsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adminsUrl = `${inject(API_BASE_URL)}/admin/settings/admins`;

  getAdmins(): Observable<readonly DashboardAdmin[]> {
    return this.httpClient
      .get<readonly LiveTeamMember[]>(this.adminsUrl)
      .pipe(
        map((members) =>
          members.filter((member) => !isAppRoleName(member.roleName)).map(toDashboardAdmin),
        ),
      );
  }

  inviteAdmin(invitation: AdminInvitation): Observable<DashboardAdmin> {
    return this.httpClient
      .post<LiveEnvelope<LiveTeamMember>>(this.adminsUrl, invitation)
      .pipe(map(({ data }) => toDashboardAdmin(data)));
  }
}
