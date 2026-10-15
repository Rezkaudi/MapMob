import { toIsoDay } from '../../../shared/formatting/iso-day';
import { isActiveStatus } from '../../../shared/data/live-activation';
import { AdminRole } from '../models/admin-role';
import { DashboardAdmin } from '../models/dashboard-admin';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';
import { LivePlatformSettings } from './live-platform-settings';
import { LiveSettingsRole } from './live-settings-role';
import { LiveTeamMember } from './live-team-member';

// The server keeps app users and store owners with the admins; these roles are not the dashboard team.
const APP_ROLE_NAMES: ReadonlySet<string> = new Set(['customer', 'vendor']);

export function isAppRoleName(roleName: string): boolean {
  return APP_ROLE_NAMES.has(roleName);
}

export function toDashboardAdmin(live: LiveTeamMember): DashboardAdmin {
  return {
    id: live.id,
    fullName: live.fullName,
    email: live.email ?? '',
    roleId: live.roleId,
    roleName: live.roleName,
    status: live.status,
    lastSignInOn: live.lastSignInAt ? toIsoDay(live.lastSignInAt) : null,
  };
}

export function toAdminRole(live: LiveSettingsRole): AdminRole {
  return {
    id: live.id,
    name: live.name,
    englishName: live.englishName,
    description: live.description ?? '',
    icon: live.icon,
    isFullAccess: live.isFullAccess,
    isActive: isActiveStatus(live.status),
    grants: live.grants,
    adminCount: live.adminCount,
  };
}

function toLogoFileName(logoUrl: string | null): string {
  return logoUrl?.split('/').pop() ?? '';
}

export function toPlatformGeneral(live: LivePlatformSettings['general']): PlatformGeneralSettings {
  return {
    appName: live.appName,
    logoFileName: toLogoFileName(live.logoUrl),
    supportEmail: live.supportEmail,
    supportPhone: live.supportPhone,
  };
}

export function toPlatformSettings(live: LivePlatformSettings): PlatformSettings {
  return { ...live, general: toPlatformGeneral(live.general) };
}
