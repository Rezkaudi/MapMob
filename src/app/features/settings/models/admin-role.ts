import { AdminRoleIcon } from './admin-role-icon';
import { PermissionGrant } from './permission-grant';

export interface AdminRole {
  readonly id: string;
  readonly name: string;
  readonly englishName: string;
  readonly description: string;
  readonly icon: AdminRoleIcon;
  /** The system owner role: every permission, shown but never edited. */
  readonly isFullAccess: boolean;
  readonly isActive: boolean;
  readonly grants: readonly PermissionGrant[];
  readonly adminCount: number;
}
