import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AdminInvitation } from '../models/admin-invitation';
import { DashboardAdmin } from '../models/dashboard-admin';
import { AdminsRepository } from './admins.repository';

@Injectable()
export class AdminsHttpRepository implements AdminsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get adminsUrl(): string {
    return `${this.apiBaseUrl}/settings/admins`;
  }

  getAdmins(): Observable<readonly DashboardAdmin[]> {
    return this.httpClient.get<readonly DashboardAdmin[]>(this.adminsUrl);
  }

  inviteAdmin(invitation: AdminInvitation): Observable<DashboardAdmin> {
    return this.httpClient.post<DashboardAdmin>(this.adminsUrl, invitation);
  }
}
