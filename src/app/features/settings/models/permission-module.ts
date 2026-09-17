import { PermissionAction } from './permission-action';
import { PermissionModuleId } from './permission-module-id';

export interface PermissionModule {
  readonly id: PermissionModuleId;
  readonly label: string;
  /** The actions this section has; the matrix draws a dash for the rest. */
  readonly actions: readonly PermissionAction[];
}
