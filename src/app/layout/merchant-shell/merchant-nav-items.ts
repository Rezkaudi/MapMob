import { NavItem } from '../sidebar/nav-item';
import { UserMenuItem } from '../user-menu/user-menu-item';

export const MERCHANT_HOME_ROUTE = '/merchant/dashboard';
export const MERCHANT_NOTIFICATIONS_ROUTE = '/merchant/notifications';
export const MERCHANT_SETTINGS_ROUTE = '/merchant/settings';

/** The main group, in the order the merchant overview frame lists it. */
export const MERCHANT_NAV_ITEMS: readonly NavItem[] = [
  { label: 'الرئيسية', route: MERCHANT_HOME_ROUTE, icon: 'home' },
  { label: 'بيانات المتجر', route: '/merchant/store', icon: 'building' },
  { label: 'المنتجات', route: '/merchant/products', icon: 'package' },
  { label: 'العروض', route: '/merchant/offers', icon: 'offers' },
  { label: 'الصور والوسائط', route: '/merchant/media', icon: 'media' },
  { label: 'التقييمات و المراجعات', route: '/merchant/reviews', icon: 'reviews' },
  { label: 'الاشتراكات والباقات', route: '/merchant/subscription', icon: 'subscriptions' },
];

export const MERCHANT_SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { label: 'الإشعارات', route: MERCHANT_NOTIFICATIONS_ROUTE, icon: 'notifications' },
  { label: 'الإعدادات', route: MERCHANT_SETTINGS_ROUTE, icon: 'settings' },
];

export const MERCHANT_USER_MENU_ITEMS: readonly UserMenuItem[] = [
  { label: 'الإعدادات', icon: 'settings', route: MERCHANT_SETTINGS_ROUTE },
  { label: 'الإشعارات', icon: 'notifications', route: MERCHANT_NOTIFICATIONS_ROUTE },
];
