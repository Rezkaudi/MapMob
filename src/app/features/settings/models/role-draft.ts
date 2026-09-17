import { AdminRole } from './admin-role';

export type RoleDraft = Pick<AdminRole, 'name' | 'description' | 'isActive' | 'grants'>;
