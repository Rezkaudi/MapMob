import { PermissionAction } from '../models/permission-action';
import { PermissionGrant } from '../models/permission-grant';
import { PermissionModule } from '../models/permission-module';
import { PermissionModuleId } from '../models/permission-module-id';

const ALL_ACTIONS: readonly PermissionAction[] = ['view', 'add', 'edit', 'delete'];
const VIEW_ONLY: readonly PermissionAction[] = ['view'];
const NO_ADDING: readonly PermissionAction[] = ['view', 'edit', 'delete'];

export const PERMISSION_MODULES: readonly PermissionModule[] = [
  { id: 'home', label: 'الرئيسية والإحصائيات العامة', actions: VIEW_ONLY },
  { id: 'places', label: 'الشركات والمتاجر', actions: ALL_ACTIONS },
  { id: 'categories', label: 'التصنيفات', actions: ALL_ACTIONS },
  { id: 'regions', label: 'المحافظات والمناطق', actions: ALL_ACTIONS },
  { id: 'users', label: 'المستخدمون والمشرفون', actions: ALL_ACTIONS },
  { id: 'reviews', label: 'التقييمات والمراجعات', actions: NO_ADDING },
  { id: 'offers', label: 'العروض والتخفيضات', actions: ALL_ACTIONS },
  { id: 'subscriptions', label: 'الاشتراكات والباقات', actions: ALL_ACTIONS },
  { id: 'payments', label: 'المدفوعات', actions: VIEW_ONLY },
  { id: 'reports', label: 'الإحصائيات والتقارير', actions: VIEW_ONLY },
  { id: 'complaints', label: 'البلاغات والشكاوى', actions: NO_ADDING },
  { id: 'notifications', label: 'إدارة الإشعارات', actions: ALL_ACTIONS },
  { id: 'content', label: 'إدارة المحتوى والصفحات', actions: ALL_ACTIONS },
  { id: 'system', label: 'إعدادات النظام والأمان', actions: ALL_ACTIONS },
];

export function toPermissionGrant(
  module: PermissionModuleId,
  action: PermissionAction,
): PermissionGrant {
  return `${module}:${action}`;
}

export function allPermissionGrants(): readonly PermissionGrant[] {
  return PERMISSION_MODULES.flatMap((module) =>
    module.actions.map((action) => toPermissionGrant(module.id, action)),
  );
}
