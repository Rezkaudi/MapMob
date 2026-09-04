import {
  LucideBanknote,
  LucideBarChart2,
  LucideBell,
  LucideBuilding2,
  LucideCreditCard,
  LucideFlag,
  LucideHome,
  LucideLayoutGrid,
  LucideMapPin,
  LucideMegaphone,
  LucideSettings,
  LucideStar,
  LucideTag,
  LucideUsers,
} from '@lucide/angular';
import { NavItem } from './nav-item';

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'الرئيسية', route: '/dashboard', icon: LucideHome },
  { label: 'الشركات والمتاجر', route: '/places', icon: LucideBuilding2 },
  { label: 'التصنيفات', route: '/categories', icon: LucideLayoutGrid },
  { label: 'المحافظات والمناطق', route: '/regions', icon: LucideMapPin },
  { label: 'المستخدمون', route: '/users', icon: LucideUsers },
  { label: 'التقييمات و المراجعات', route: '/reviews', icon: LucideStar },
  { label: 'العروض', route: '/offers', icon: LucideTag },
  { label: 'الإعلانات', route: '/ads', icon: LucideMegaphone },
  { label: 'الاشتراكات والباقات', route: '/subscriptions', icon: LucideCreditCard },
  { label: 'المدفوعات', route: '/payments', icon: LucideBanknote },
  { label: 'الإحصائيات و التقارير', route: '/reports', icon: LucideBarChart2 },
  { label: 'الإشعارات', route: '/notifications', icon: LucideBell },
  { label: 'الإعدادات', route: '/settings', icon: LucideSettings },
  { label: 'البلاغات', route: '/reports-log', icon: LucideFlag },
];
