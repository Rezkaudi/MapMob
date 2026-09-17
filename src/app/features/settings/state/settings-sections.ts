import { SettingsSection } from '../models/settings-section';

const TAB_ICON_SIZE = 16;
const BELL_ICON_SIZE = 20;
const LABEL_CLASSES = 'text-[12px]/[20px]';
const ADMIN_LABEL_CLASSES = 'text-[14px]/[20px]';

export const SETTINGS_URL = '/settings';

export const SETTINGS_SECTIONS: readonly SettingsSection[] = [
  {
    path: 'account',
    label: 'الحساب',
    icon: 'settings-user',
    iconSize: TAB_ICON_SIZE,
    labelClasses: LABEL_CLASSES,
  },
  {
    path: 'platform',
    label: 'إعدادات المنصة',
    icon: 'settings-layout',
    iconSize: TAB_ICON_SIZE,
    labelClasses: LABEL_CLASSES,
  },
  {
    path: 'notifications',
    label: 'إعدادات الإشعارات',
    icon: 'notifications',
    iconSize: BELL_ICON_SIZE,
    labelClasses: LABEL_CLASSES,
  },
  {
    path: 'payments',
    label: 'إعدادات الدفع',
    icon: 'payments',
    iconSize: TAB_ICON_SIZE,
    labelClasses: LABEL_CLASSES,
  },
  {
    path: 'admins',
    label: 'مشرفوا لوحة التحكم',
    icon: 'settings-users',
    iconSize: TAB_ICON_SIZE,
    labelClasses: ADMIN_LABEL_CLASSES,
  },
  {
    path: 'roles',
    label: 'الأدوار والصلاحيات',
    icon: 'settings-user-check',
    iconSize: TAB_ICON_SIZE,
    labelClasses: ADMIN_LABEL_CLASSES,
  },
];
