import { DashboardAdmin } from './dashboard-admin';

export type AdminInvitation = Pick<DashboardAdmin, 'fullName' | 'email' | 'roleId'>;
