import type { AuthenticatedUser } from '../../../auth/models/authenticated-user';
import type { Credentials } from '../../../auth/models/credentials';
import type { NewPassword } from '../../../merchant-auth/models/new-password';
import type { PasswordResetGrant } from '../../../merchant-auth/models/password-reset-grant';
import type { ResetCodeCheck } from '../../../merchant-auth/models/reset-code-check';
import type { MerchantOverview } from '../../../merchant-overview/models/merchant-overview';
import type { StorePerformance } from '../../../merchant-overview/models/store-performance';

export const OWNER_SIGN_IN_REQUEST = {
  email: 'rawabi@gmail.com',
  password: 'secret-password',
} satisfies Credentials;

export const SIGNED_IN_OWNER = {
  id: '41',
  name: 'أحمد',
  role: 'owner',
  avatarUrl: null,
  token: '27|q8PzWcm1dKbX0oLs3YhT9vNaRf6uEi2GjSkM4tBy',
} satisfies AuthenticatedUser;

export const RESET_CODE_REQUEST = { email: 'rawabi@gmail.com' };

export const RESET_CODE_CHECK = {
  email: 'rawabi@gmail.com',
  code: '482915',
} satisfies ResetCodeCheck;

export const RESET_GRANT = {
  resetToken: 'b1f4c7e2-9a3d-4e8b-8f21-6c0d5a7e3b94',
} satisfies PasswordResetGrant;

export const NEW_PASSWORD_REQUEST = {
  resetToken: 'b1f4c7e2-9a3d-4e8b-8f21-6c0d5a7e3b94',
  password: 'new-secret-1',
} satisfies NewPassword;

export const OWNER_OVERVIEW = {
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
      id: '901',
      kind: 'review',
      message: 'تم تسجيل 3 تقييمات ممتازة لمتجرك',
      occurredAt: '2026-07-26T09:15:00Z',
    },
    {
      id: '900',
      kind: 'offer',
      message: 'عرضك الترويجي حقق 100 مشاهدة جديدة',
      occurredAt: '2026-07-25T18:40:00Z',
    },
  ],
  latestReviews: [
    {
      id: '5120',
      authorName: 'سارة أحمد',
      rating: 4,
      comment: 'الخدمة ممتازة جداً، والطاقم متعاون للغاية.',
      createdAt: '2026-07-24T10:00:00Z',
    },
  ],
  subscription: {
    plan: { id: '3', name: 'الباقة المميزة' },
    startsOn: '2026-01-01',
    endsOn: '2026-12-31',
    features: ['ظهور متقدم في نتائج البحث', '50 منتج مضاف إلى متجرك'],
  },
} satisfies MerchantOverview;

export const OWNER_PERFORMANCE = {
  points: [
    { label: 'Jun', value: 60 },
    { label: 'Jul', value: 400 },
    { label: 'Aug', value: 140 },
  ],
  dailyAverageViewCount: 42,
  peakDay: { on: '2026-07-23', viewCount: 142 },
} satisfies StorePerformance;
