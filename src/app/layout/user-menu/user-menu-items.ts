import { UserMenuItem } from './user-menu-item';

/** The links above the sign-out row. */
export const USER_MENU_ITEMS: readonly UserMenuItem[] = [
  { label: 'الملف الشخصي', icon: 'users', route: '/admin/settings/account' },
  { label: 'الإعدادات', icon: 'settings', route: '/admin/settings' },
  { label: 'الإشعارات', icon: 'notifications', route: '/admin/notifications' },
];
