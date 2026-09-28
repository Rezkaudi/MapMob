import { MerchantStatCard } from '../models/merchant-stat-card';
import { MerchantStats } from '../models/merchant-stats';

const LAST_30_DAYS_CAPTION = 'آخر 30 يوماً';
const RATING_DECIMALS = 1;

/** "%14+" is how the design writes a rise; a fall or no change gets no chip. */
export function formatChangePercent(percent: number): string | null {
  return percent > 0 ? `%${percent}+` : null;
}

/** RTL puts the first card on the right, so this reads the design right to left. */
export function buildMerchantStatCards(stats: MerchantStats): readonly MerchantStatCard[] {
  return [
    {
      icon: 'eye-feather',
      label: 'مشاهدات متجرك',
      value: String(stats.viewCount),
      valueDirection: 'ltr',
      caption: LAST_30_DAYS_CAPTION,
      delta: formatChangePercent(stats.viewChangePercent),
    },
    {
      icon: 'search-feather',
      label: 'مرات الظهور في البحث',
      value: String(stats.searchAppearanceCount),
      valueDirection: 'ltr',
      caption: LAST_30_DAYS_CAPTION,
      delta: formatChangePercent(stats.searchAppearanceChangePercent),
    },
    {
      icon: 'heart-feather',
      label: 'المفضلة',
      value: `${stats.favoriteCount} مستخدم`,
      valueDirection: 'rtl',
      caption: 'أضافوا متجرك إلى المفضلة',
      delta: null,
    },
    {
      icon: 'star-feather',
      label: 'متوسط التقييم',
      value: stats.averageRating.toFixed(RATING_DECIMALS),
      valueDirection: 'ltr',
      caption: `مستند إلى ${stats.reviewCount} مراجعة`,
      delta: null,
    },
  ];
}
