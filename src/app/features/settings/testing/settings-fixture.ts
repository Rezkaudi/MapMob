import { AccountProfile } from '../models/account-profile';
import { AdminRole } from '../models/admin-role';
import { DashboardAdmin } from '../models/dashboard-admin';
import { PaymentMethod } from '../models/payment-method';
import { NotificationAlert } from '../models/notification-alert';
import { PlatformSettings } from '../models/platform-settings';

export function buildAccountProfile(overrides: Partial<AccountProfile> = {}): AccountProfile {
  return {
    fullName: 'خولة محمد',
    email: 'khawla.mo@mapmob.com',
    roleName: 'مسؤول النظام الرئيسي (Super Admin)',
    ...overrides,
  };
}

export function buildPlatformSettings(overrides: Partial<PlatformSettings> = {}): PlatformSettings {
  return {
    general: {
      appName: 'MapMob',
      logoFileName: 'MapMob_logo.svg',
      supportEmail: 'supportmapmob@gmail.com',
      supportPhone: '+9639456788',
    },
    map: { distanceUnit: 'kilometer', searchRadiusKm: 15 },
    language: { defaultLanguage: 'ar', detectsDeviceLanguage: true },
    currency: { currency: 'SYP', currencySymbol: 'ل.س', decimalPlaces: 0 },
    ...overrides,
  };
}

export function buildNotificationAlerts(): readonly NotificationAlert[] {
  return [
    { kind: 'new-complaint', isEnabled: true },
    { kind: 'place-awaiting-approval', isEnabled: true },
    { kind: 'review-reported', isEnabled: true },
    { kind: 'subscription-expiring', isEnabled: true },
    { kind: 'new-payment', isEnabled: false },
  ];
}

export function buildPaymentMethod(overrides: Partial<PaymentMethod> = {}): PaymentMethod {
  return {
    id: 'payment-method-1',
    name: 'دفع نقدي',
    kind: 'manual',
    status: 'active',
    ...overrides,
  };
}

export function buildAdminRole(overrides: Partial<AdminRole> = {}): AdminRole {
  return {
    id: 'role-2',
    name: 'مشرف',
    englishName: 'Admin',
    description: 'صلاحيات إدارية عامة لإدارة الأماكن والعروض والاشتراكات والمستخدمين',
    icon: 'shield',
    isFullAccess: false,
    isActive: true,
    grants: ['places:view', 'places:add'],
    adminCount: 2,
    ...overrides,
  };
}

export function buildDashboardAdmin(overrides: Partial<DashboardAdmin> = {}): DashboardAdmin {
  return {
    id: 'admin-2',
    fullName: 'مريم محمد',
    email: 'maryam.m@mapmob.com',
    roleId: 'role-2',
    roleName: 'مشرف',
    status: 'active',
    lastSignInOn: '2024-01-26',
    ...overrides,
  };
}
