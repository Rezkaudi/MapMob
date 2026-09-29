import type { MerchantSubscriptionOverview } from '../../../merchant-subscription/models/merchant-subscription-overview';
import type { PlanChangeDraft } from '../../../merchant-subscription/models/plan-change-draft';
import type { PlanChangeRequest } from '../../../merchant-subscription/models/plan-change-request';
import type { SubscriptionRecord } from '../../../merchant-subscription/models/subscription-record';

const CURRENT_PERIOD = {
  id: '41',
  plan: { id: '2', name: 'الباقة الأساسية' },
  term: 'monthly',
  price: { amount: 150000, currency: 'SYP' },
  paymentMethod: 'cash',
  startsOn: '2026-09-01',
  endsOn: '2026-10-01',
  status: 'active',
} satisfies SubscriptionRecord;

export const OWNER_PLAN_CHANGE_REQUEST = {
  id: '7',
  kind: 'upgrade',
  plan: { id: '3', name: 'الباقة المميزة' },
  term: 'monthly',
  status: 'pending',
  createdAt: '2026-09-29T10:15:00Z',
} satisfies PlanChangeRequest;

export const OWNER_SUBSCRIPTION = {
  current: CURRENT_PERIOD,
  usage: {
    products: { used: 8, limit: 10 },
    galleryImages: { used: 15, limit: 20 },
    activeOffers: { used: 2, limit: 5 },
    adsThisMonth: { used: 2, limit: 5 },
  },
  plans: [
    {
      id: '1',
      name: 'الباقة المجانية',
      tier: 'free',
      tagline: 'مناسبة للمتاجر الجديدة للتعرف على منصة MapMob وبدء التواجد الأولي.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: 'SYP',
      limits: { products: 3, galleryImages: 5, activeOffers: 1, adsPerMonth: 1, videos: 0 },
      features: ['عدد محدود من المنتجات والخدمات (حتى 3)', 'ظهور اعتيادي في نتائج البحث'],
    },
    {
      id: '2',
      name: 'الباقة الأساسية',
      tier: 'basic',
      tagline: 'للمتاجر النشطة التي تحتاج إلى إضافة خدمات متنوعة وعروض مستمرة لجذب الزبائن.',
      monthlyPrice: 150000,
      yearlyPrice: 1440000,
      currency: 'SYP',
      limits: { products: 10, galleryImages: 20, activeOffers: 5, adsPerMonth: 5, videos: 1 },
      features: ['حتى 10 منتجات وخدمات مع الأسعار', 'حتى 20 صورة عالية الجودة للمتجر'],
    },
    {
      id: '3',
      name: 'الباقة المميزة',
      tier: 'featured',
      tagline: 'للمتاجر والشركات الكبرى التي تسعى للتصدر والوصول الأوسع في جميع مناطق المدينة.',
      monthlyPrice: 300000,
      yearlyPrice: 2880000,
      currency: 'SYP',
      limits: {
        products: null,
        galleryImages: 100,
        activeOffers: null,
        adsPerMonth: null,
        videos: null,
      },
      features: ['منتجات و خدمات غير محدود.', 'إعلانات في الواجهة الرئيسية والتصنيفات'],
    },
  ],
  history: [
    CURRENT_PERIOD,
    {
      id: '33',
      plan: { id: '1', name: 'الباقة المجانية' },
      term: 'monthly',
      price: { amount: 0, currency: 'SYP' },
      paymentMethod: 'cash',
      startsOn: '2026-08-01',
      endsOn: '2026-09-01',
      status: 'expired',
    },
  ],
  pendingRequest: null,
} satisfies MerchantSubscriptionOverview;

export const OWNER_PLAN_CHANGE_BODY = {
  kind: 'upgrade',
  planId: '3',
  term: 'monthly',
} satisfies PlanChangeDraft;
