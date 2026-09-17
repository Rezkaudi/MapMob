import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { UsageMetric } from '../models/usage-metric';

export const CATEGORY_SHARES: readonly CategoryShare[] = [
  { categoryName: 'مطاعم', share: 29 },
  { categoryName: 'كافيات', share: 22 },
  { categoryName: 'صيدليات', share: 17 },
  { categoryName: 'نوادي', share: 14 },
  { categoryName: 'مكتبات', share: 9 },
  { categoryName: 'متاجر ألبسة', share: 9 },
];

export const GOVERNORATE_ACTIVITIES: readonly GovernorateActivity[] = [
  { governorateName: 'دمشق', visitCount: 16750, share: 32 },
  { governorateName: 'طرطوس', visitCount: 12560, share: 24 },
  { governorateName: 'حمص', visitCount: 9420, share: 18 },
  { governorateName: 'اللاذقية', visitCount: 7850, share: 15 },
  { governorateName: 'حلب', visitCount: 5760, share: 11 },
];

export const WEEKLY_USAGE_METRICS: readonly UsageMetric[] = [
  { label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 },
  { label: 'مشاهدة تفاصيل الأماكن', count: 18420, share: 32 },
  { label: 'استخدام الخريطة والتوجيه', count: 14300, share: 25 },
  { label: 'مشاهدة العروض والتخفيضات', count: 9850, share: 17 },
];

export const WEEKLY_ACTIVE_USERS = [34, 56, 68, 74, 78, 83, 99] as const;
export const WEEKLY_NEW_USERS = [12, 25, 35, 44, 46, 66, 69] as const;

export const MONTHLY_REVENUE = [
  19600, 46400, 41200, 20600, 18900, 12000, 48200, 15500, 29200, 20600, 38500, 27500,
] as const;
