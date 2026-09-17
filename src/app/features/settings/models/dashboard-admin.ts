import { ActivationStatus } from '../../../shared/models/activation-status';

export interface DashboardAdmin {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly roleId: string;
  readonly roleName: string;
  readonly status: ActivationStatus;
  /** `yyyy-mm-dd`, or null until the admin signs in for the first time. */
  readonly lastSignInOn: string | null;
}
