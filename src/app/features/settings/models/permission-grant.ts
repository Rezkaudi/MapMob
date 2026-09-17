import { PermissionAction } from './permission-action';
import { PermissionModuleId } from './permission-module-id';

/** One ticked box of the permission matrix, e.g. "places:edit". */
export type PermissionGrant = `${PermissionModuleId}:${PermissionAction}`;
