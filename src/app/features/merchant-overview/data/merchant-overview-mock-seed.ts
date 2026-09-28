import { CHART_PERIOD_LABELS } from '../../../../mock/chart-period-labels';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';

export const MERCHANT_OVERVIEW_SEED: MerchantOverview = {
  placeName: 'مطعم الروابي',
  stats: {
    viewCount: 2300,
    viewChangePercent: 14,
    searchAppearanceCount: 200,
    searchAppearanceChangePercent: 8,
    favoriteCount: 73,
    averageRating: 4.7,
    reviewCount: 1000,
  },
  activities: [
    {
      id: 'activity-1',
      kind: 'review',
      message: 'تم تسجيل 3 تقييمات ممتازة لمتجرك',
      occurredAt: '2026-07-26T09:15:00Z',
    },
    {
      id: 'activity-2',
      kind: 'offer',
      message: 'عرضك الترويجي حقق 100 مشاهدة جديدة',
      occurredAt: '2026-07-25T18:40:00Z',
    },
    {
      id: 'activity-3',
      kind: 'alert',
      message: 'تم تسجيل تقييم منخفض لمتجرك',
      occurredAt: '2026-07-25T11:05:00Z',
    },
    {
      id: 'activity-4',
      kind: 'alert',
      message: 'ينتهي عرضك الترويجي خلال 3 أيام',
      occurredAt: '2026-07-24T08:00:00Z',
    },
  ],
  latestReviews: [
    {
      id: 'review-1',
      authorName: 'سارة أحمد',
      rating: 4,
      comment:
        '"الخدمة ممتازة جداً، طلبت استشارة عن كريم مرطب والدكتور أحمد كان دقيقاً ومتعاوناً للغاية."',
      createdAt: '2026-07-24T10:00:00Z',
    },
    {
      id: 'review-2',
      authorName: 'محمد خالد',
      rating: 4,
      comment: '"مكان نظيف وطاقم لطيف، والطلب وصل بسرعة. سأعود مرة أخرى بالتأكيد."',
      createdAt: '2026-07-24T08:30:00Z',
    },
  ],
  subscription: {
    plan: { id: 'plan-featured', name: 'الباقة المميزة' },
    startsOn: '2026-01-01',
    endsOn: '2026-12-31',
    features: ['ظهور متقدم في نتائج البحث', '50 منتج مضاف إلى متجرك', 'معرض صور وفيديوهات متكامل'],
  },
};

// The monthly wave follows the frame: a spring rise, a June dip, the July peak of 400.
const VIEW_COUNTS: Record<ChartPeriod, readonly number[]> = {
  daily: [4, 9, 18, 26, 31, 14],
  weekly: [36, 41, 29, 52, 47, 38, 24],
  monthly: [180, 330, 260, 150, 120, 60, 400, 140, 230, 190, 300, 210],
  yearly: [3100, 6400, 9800, 12100, 15300],
};

const DAILY_AVERAGES: Record<ChartPeriod, number> = {
  daily: 17,
  weekly: 38,
  monthly: 42,
  yearly: 35,
};

export function buildStorePerformanceSeed(period: ChartPeriod): StorePerformance {
  const labels = CHART_PERIOD_LABELS[period];
  return {
    points: labels.map((label, index) => ({ label, value: VIEW_COUNTS[period][index] ?? 0 })),
    dailyAverageViewCount: DAILY_AVERAGES[period],
    peakDay: { on: '2026-07-23', viewCount: 142 },
  };
}
