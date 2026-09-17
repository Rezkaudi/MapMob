import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminInvitation } from '../models/admin-invitation';
import { DashboardAdmin } from '../models/dashboard-admin';
import { AdminsRepository } from './admins.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class AdminsMockRepository implements AdminsRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getAdmins(): Observable<readonly DashboardAdmin[]> {
    return this.loader.request((database) => database.team.admins());
  }

  inviteAdmin(invitation: AdminInvitation): Observable<DashboardAdmin> {
    return this.loader.request((database) => database.team.inviteAdmin(invitation));
  }
}
