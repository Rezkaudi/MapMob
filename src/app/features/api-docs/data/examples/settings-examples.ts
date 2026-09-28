import type { AccountProfile } from '../../../settings/models/account-profile';
import type { AdminInvitation } from '../../../settings/models/admin-invitation';
import type { NotificationAlert } from '../../../settings/models/notification-alert';
import type { PasswordChange } from '../../../settings/models/password-change';
import type { PaymentMethod } from '../../../settings/models/payment-method';

export const ACCOUNT_PROFILE = {
  fullName: 'Obedah',
  email: 'obedah@gmail.com',
  roleName: 'مسؤول النظام الرئيسي (Super Admin)',
} satisfies AccountProfile;

export const PASSWORD_CHANGE = {
  currentPassword: 'old-secret',
  newPassword: 'new-secret-2026',
} satisfies PasswordChange;

export const DASHBOARD_ADMIN = {
  id: '2',
  fullName: 'سارة حداد',
  email: 'sara@mapmob.com',
  roleId: '2',
  roleName: 'مشرف دعم',
  status: 'active',
  lastSignInAt: null,
};

export const ADMIN_INVITATION = {
  fullName: 'سارة حداد',
  email: 'sara@mapmob.com',
  roleId: '2',
} satisfies AdminInvitation;

export const ADMIN_ROLE = {
  id: '2',
  name: 'مشرف دعم',
  englishName: 'Support',
  description: 'يرد على البلاغات والتقييمات',
  icon: 'headset',
  isFullAccess: false,
  status: 'active',
  grants: ['complaints:view', 'complaints:edit', 'reviews:view', 'reviews:edit'],
  adminCount: 3,
};

export const ROLE_DRAFT = {
  name: 'مشرف دعم',
  description: 'يرد على البلاغات والتقييمات',
  status: 'active',
  grants: ['complaints:view', 'complaints:edit', 'reviews:view', 'reviews:edit'],
};

export const NOTIFICATION_ALERTS = [
  { kind: 'new-complaint', isEnabled: true },
  { kind: 'place-awaiting-approval', isEnabled: true },
  { kind: 'review-reported', isEnabled: false },
  { kind: 'subscription-expiring', isEnabled: true },
  { kind: 'new-payment', isEnabled: true },
] satisfies NotificationAlert[];

export const PAYMENT_METHOD = {
  id: '1',
  name: 'نقداً',
  kind: 'manual',
  status: 'active',
} satisfies PaymentMethod;

export const PLATFORM_SETTINGS = {
  general: {
    appName: 'MapMob',
    logoUrl: 'https://api.mapmob.com.co/storage/platform/logo.png',
    supportEmail: 'support@mapmob.com',
    supportPhone: '0931234567',
  },
  map: { distanceUnit: 'kilometer', searchRadiusKm: 10 },
  language: { defaultLanguage: 'ar', detectsDeviceLanguage: true },
  currency: { currency: 'SYP', currencySymbol: 'ل.س', decimalPlaces: 0 },
};

export const PLATFORM_GENERAL_FORM = {
  appName: 'MapMob',
  supportEmail: 'support@mapmob.com',
  supportPhone: '0931234567',
  logo: '@mapmob-logo.png',
};
