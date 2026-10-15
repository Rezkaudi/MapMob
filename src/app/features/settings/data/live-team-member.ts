import { ActivationStatus } from '../../../shared/models/activation-status';

/** One row of `/admin/settings/admins`. The list holds every account, app users included. */
export interface LiveTeamMember {
  readonly id: string;
  readonly fullName: string;
  readonly email: string | null;
  readonly roleId: string;
  readonly roleName: string;
  readonly status: ActivationStatus;
  readonly lastSignInAt: string | null;
}
