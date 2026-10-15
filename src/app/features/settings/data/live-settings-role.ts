import { ActivationStatus } from '../../../shared/models/activation-status';
import { AdminRoleIcon } from '../models/admin-role-icon';
import { PermissionGrant } from '../models/permission-grant';

/** One row of `/admin/settings/roles`. */
export interface LiveSettingsRole {
  readonly id: string;
  readonly name: string;
  readonly englishName: string;
  readonly description: string | null;
  readonly icon: AdminRoleIcon;
  readonly isFullAccess: boolean;
  readonly status: ActivationStatus;
  readonly grants: readonly PermissionGrant[];
  readonly adminCount: number;
}
