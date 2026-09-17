import { Observable } from 'rxjs';
import { AdminInvitation } from '../models/admin-invitation';
import { DashboardAdmin } from '../models/dashboard-admin';

export abstract class AdminsRepository {
  abstract getAdmins(): Observable<readonly DashboardAdmin[]>;
  /** Creates the admin; the server emails the link that activates the account. */
  abstract inviteAdmin(invitation: AdminInvitation): Observable<DashboardAdmin>;
}
