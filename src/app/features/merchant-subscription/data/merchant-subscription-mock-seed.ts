import { MerchantPlan } from '../models/merchant-plan';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { SubscriptionRecord } from '../models/subscription-record';

const FREE_PLAN: MerchantPlan = {
  id: 'plan-free',
  name: 'الباقة المجانية',
  tier: 'free',
  tagline: 'مناسبة للمتاجر الجديدة للتعرف على منصة MapMob وبدء التواجد الأولي.',
  monthlyPrice: 0,
  yearlyPrice: 0,
  currency: 'SYP',
  limits: { products: 3, galleryImages: 5, activeOffers: 1, adsPerMonth: 1, videos: 0 },
  features: [
    'عدد محدود من المنتجات والخدمات (حتى 3)',
    'عدد محدود من الصور (حتى 5 صور)',
    'عرض ترويجي واحد فقط نشط',
    'لا تتضمن إعلانات في الواجهة الرئيسية',
    'ظهور اعتيادي في نتائج البحث',
  ],
};

const BASIC_PLAN: MerchantPlan = {
  id: 'plan-basic',
  name: 'الباقة الأساسية',
  tier: 'basic',
  tagline: 'للمتاجر النشطة التي تحتاج إلى إضافة خدمات متنوعة وعروض مستمرة لجذب الزبائن.',
  monthlyPrice: 150000,
  yearlyPrice: 1440000,
  currency: 'SYP',
  limits: { products: 10, galleryImages: 20, activeOffers: 5, adsPerMonth: 5, videos: 1 },
  features: [
    'حتى 10 منتجات وخدمات مع الأسعار',
    'حتى 20 صورة عالية الجودة للمتجر',
    'حتى 5 عروض وخصومات نشطة في آن واحد',
    'حتى 5 حملات إعلانية في نتائج البحث',
    'ظهور أولوية متوسطة على الخريطة وقائمة التاجر',
  ],
};

const FEATURED_PLAN: MerchantPlan = {
  id: 'plan-featured',
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
  features: [
    'منتجات و خدمات غير محدود.',
    'معرض حتى 100 صورة + فيديو ترويجي.',
    'عروض و خدمات غير محدودة.',
    'إعلانات في الواجهة الرئيسية والتصنيفات',
  ],
};

function basicPeriod(id: string, startsOn: string, endsOn: string): SubscriptionRecord {
  return {
    id,
    plan: { id: BASIC_PLAN.id, name: BASIC_PLAN.name },
    term: 'monthly',
    price: { amount: BASIC_PLAN.monthlyPrice, currency: 'SYP' },
    paymentMethod: 'cash',
    startsOn,
    endsOn,
    status: 'expired',
  };
}

const CURRENT_PERIOD: SubscriptionRecord = {
  ...basicPeriod('subscription-3', '2026-09-01', '2026-10-01'),
  status: 'active',
};

/** The subscription frame: basic plan, 8 of 10 products, and three months of history. */
export function buildMerchantSubscriptionSeed(): MerchantSubscriptionOverview {
  return {
    current: CURRENT_PERIOD,
    usage: {
      products: { used: 8, limit: 10 },
      galleryImages: { used: 15, limit: 20 },
      activeOffers: { used: 2, limit: 5 },
      adsThisMonth: { used: 2, limit: 5 },
    },
    plans: [FREE_PLAN, BASIC_PLAN, FEATURED_PLAN],
    history: [
      CURRENT_PERIOD,
      {
        id: 'subscription-2',
        plan: { id: FREE_PLAN.id, name: FREE_PLAN.name },
        term: 'monthly',
        price: { amount: 0, currency: 'SYP' },
        paymentMethod: 'cash',
        startsOn: '2026-08-01',
        endsOn: '2026-09-01',
        status: 'expired',
      },
      basicPeriod('subscription-1', '2026-07-01', '2026-08-01'),
    ],
    pendingRequest: null,
  };
}
