import { PermissionGrant } from '../models/permission-grant';
import { allPermissionGrants } from '../state/permission-modules';

const ADMIN_LEFT_OUT = new Set<string>(['system:add', 'system:edit']);

/** Everything but deleting, and no changes to the system settings: 32 grants. */
export const ADMIN_ROLE_GRANTS: readonly PermissionGrant[] = allPermissionGrants().filter(
  (grant) => !grant.endsWith(':delete') && !ADMIN_LEFT_OUT.has(grant),
);

/** Reports, reviews and notifications follow-up: 14 grants. */
export const SUPPORT_ROLE_GRANTS: readonly PermissionGrant[] = [
  'home:view',
  'places:view',
  'users:view',
  'reviews:view',
  'reviews:edit',
  'reviews:delete',
  'complaints:view',
  'complaints:edit',
  'complaints:delete',
  'notifications:view',
  'notifications:add',
  'notifications:edit',
  'notifications:delete',
  'content:view',
];
