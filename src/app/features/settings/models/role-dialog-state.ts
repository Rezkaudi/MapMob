import { AdminRole } from './admin-role';

/** The full access role opens in `view`: its permissions are shown, never changed. */
export type RoleDialogState =
  | { readonly mode: 'add' }
  | { readonly mode: 'edit'; readonly role: AdminRole }
  | { readonly mode: 'view'; readonly role: AdminRole };
