import { PackagePlan } from '../models/package-plan';

/**
 * The three packages the design draws, with its copy. The order is the one the
 * cards are laid out in, cheapest tier first — RTL puts it on the right.
 */
export const MOCK_PLANS: readonly PackagePlan[] = [
  {
    id: 'free',
    name: 'مجانية',
    tier: 'free',
    tagline: 'مناسبة للمتاجر الجديدة للتعرف على منصة MapMob وبدء التواجد الأولي.',
    badge: 'نشطة',
    monthlyPrice: 0,
    yearlyPrice: null,
    currency: 'دولار',
    subscriberCount: 450,
    limits: { adsPerMonth: 1, activeOffers: 2, galleryImages: 5, videos: 0 },
    features: ['التواجد في محرك البحث الجغرافي', 'صفحة متجر كاملة بالبيانات وموقع GPS'],
    isActive: true,
  },
  {
    id: 'basic',
    name: 'أساسية',
    tier: 'basic',
    tagline: 'الباقة المثلى للمتاجر المتوسطة لزيادة الانتشار والوصول للزبائن المحليين.',
    badge: 'الأكثر مبيعاً',
    monthlyPrice: 20,
    yearlyPrice: 192,
    currency: 'دولار',
    subscriberCount: 620,
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 30 },
    features: [
      'كل مزايا الباقة المجانية',
      'أولوية متقدمة في نتائج البحث والتصفية',
      'شارة متجر موثق باللون الأزرق',
      'تقارير المشاهدات وإحصائيات الزوار',
    ],
    isActive: true,
  },
  {
    id: 'featured',
    name: 'مميزة',
    tier: 'featured',
    tagline: 'أقصى ظهور وقوة تسويقية للعلامات والشركات',
    badge: 'VIP',
    monthlyPrice: 249,
    yearlyPrice: 2390,
    currency: 'ر.س',
    subscriberCount: 210,
    limits: { adsPerMonth: null, activeOffers: null, galleryImages: 100, videos: 30 },
    features: [
      'كافة مزايا الباقة الأساسية بالكامل',
      'ظهور دائم بالبنر المميز في الصفحة الرئيسية',
      'أعلى ترتيب جغرافي تلقائي للموقع',
      'شارة التوثيق الذهبية المضيئة',
    ],
    isActive: true,
  },
];
