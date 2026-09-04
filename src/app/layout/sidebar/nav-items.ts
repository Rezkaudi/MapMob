import { NavItem } from './nav-item';

/** The main navigation group, in the order the design lists it. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'الرئيسية', route: '/dashboard', icon: 'home' },
  { label: 'الشركات والمتاجر', route: '/places', icon: 'places' },
  { label: 'التصنيفات', route: '/categories', icon: 'categories' },
  { label: 'المحافظات والمناطق', route: '/regions', icon: 'regions' },
  { label: 'المستخدمون', route: '/users', icon: 'users' },
  { label: 'التقييمات و المراجعات', route: '/reviews', icon: 'reviews' },
  { label: 'العروض', route: '/offers', icon: 'offers' },
  { label: 'الإعلانات', route: '/ads', icon: 'ads' },
  { label: 'الاشتراكات والباقات', route: '/subscriptions', icon: 'subscriptions' },
  { label: 'المدفوعات', route: '/payments', icon: 'payments' },
  { label: 'الإحصائيات و التقارير', route: '/reports', icon: 'reports' },
];

/** The secondary group below the divider. */
export const SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { label: 'الإشعارات', route: '/notifications', icon: 'notifications' },
  { label: 'الإعدادات', route: '/settings', icon: 'settings' },
  { label: 'البلاغات', route: '/complaints', icon: 'complaints' },
];
