import { PermissionGrant } from '../models/permission-grant';

export function toggleGrant(
  grants: readonly PermissionGrant[],
  grant: PermissionGrant,
): readonly PermissionGrant[] {
  return grants.includes(grant) ? grants.filter((held) => held !== grant) : [...grants, grant];
}

/** The boxes the "add new role" design ticks, offered as a starting point. */
export const NEW_ROLE_GRANTS: readonly PermissionGrant[] = [
  'home:view',
  'places:view',
  'places:add',
  'places:edit',
  'categories:view',
  'categories:add',
  'categories:edit',
  'regions:view',
  'regions:add',
  'regions:edit',
  'users:view',
  'reviews:view',
  'reviews:edit',
  'reviews:delete',
  'offers:view',
  'offers:add',
  'offers:edit',
  'subscriptions:view',
  'payments:view',
  'reports:view',
  'complaints:view',
  'complaints:edit',
  'complaints:delete',
  'notifications:view',
  'notifications:add',
  'content:view',
  'content:add',
  'content:edit',
];
