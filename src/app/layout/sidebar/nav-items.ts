import { NavItem } from './nav-item';

/** The main navigation group, in the order the design lists it. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'الرئيسية', route: '/admin/dashboard', icon: 'home' },
  { label: 'الشركات والمتاجر', route: '/admin/places', icon: 'places' },
  { label: 'التصنيفات', route: '/admin/categories', icon: 'categories' },
  { label: 'المحافظات والمناطق', route: '/admin/regions', icon: 'regions' },
  { label: 'المستخدمون', route: '/admin/users', icon: 'users' },
  { label: 'التقييمات و المراجعات', route: '/admin/reviews', icon: 'reviews' },
  { label: 'العروض', route: '/admin/offers', icon: 'offers' },
  { label: 'الإعلانات', route: '/admin/ads', icon: 'ads' },
  { label: 'الاشتراكات والباقات', route: '/admin/subscriptions', icon: 'subscriptions' },
  { label: 'المدفوعات', route: '/admin/payments', icon: 'payments' },
  { label: 'منصات الطلبات و التوصيل', route: '/admin/delivery-platforms', icon: 'delivery' },
  { label: 'الإحصائيات و التقارير', route: '/admin/reports', icon: 'reports' },
  { label: 'إدارة المحتوى', route: '/admin/content', icon: 'content' },
];

/** The secondary group below the divider. */
export const SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { label: 'الإشعارات', route: '/admin/notifications', icon: 'notifications' },
  { label: 'البلاغات', route: '/admin/complaints', icon: 'complaints' },
  { label: 'الإعدادات', route: '/admin/settings', icon: 'settings' },
];
