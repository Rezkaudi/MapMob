import { ApiFeature } from '../../models/api-feature';
import { SETTINGS_PLATFORM_ENDPOINTS } from './settings-platform-endpoints';
import { SETTINGS_TEAM_ENDPOINTS } from './settings-team-endpoints';

export const SETTINGS_FEATURE: ApiFeature = {
  id: 'settings',
  name: 'Settings',
  screen: '/settings',
  permissionModule: 'system',
  intro:
    'Six tabs: own account, admin team, roles and permissions, alerts, payment methods and platform options. The roles tab decides what every admin may do.',
  endpoints: [...SETTINGS_TEAM_ENDPOINTS, ...SETTINGS_PLATFORM_ENDPOINTS],
};
