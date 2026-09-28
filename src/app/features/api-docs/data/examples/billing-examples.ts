export const SUBSCRIPTION_SUMMARY = {
  topPlan: { id: '3', name: 'الباقة المميزة', subscriberCount: 148 },
  activePlanCount: 3,
  endingSoonCount: 12,
  activeSubscriberCount: 268,
  activeSubscriberPercent: 64,
};

const LIMITS = { adsPerMonth: 10, activeOffers: 20, galleryImages: 100, videos: 20, products: 50 };

export const PACKAGE_PLAN = {
  id: '3',
  name: 'الباقة المميزة',
  tier: 'featured',
  tagline: 'للمتاجر الكبيرة',
  badge: 'VIP',
  monthlyPrice: 250000,
  yearlyPrice: 2400000,
  currency: 'SYP',
  subscriberCount: 148,
  limits: LIMITS,
  features: ['أولوية في نتائج البحث', 'تقارير شهرية', 'شارة موثّق'],
  status: 'active',
};

export const PLAN_DRAFT = {
  name: 'الباقة المميزة',
  tagline: 'للمتاجر الكبيرة',
  badge: 'VIP',
  monthlyPrice: 250000,
  yearlyPrice: 2400000,
  currency: 'SYP',
  limits: { ...LIMITS, videos: null },
  features: ['أولوية في نتائج البحث', 'تقارير شهرية'],
};

export const SUBSCRIPTION_ROW = {
  id: 's1',
  place: { id: '12', name: 'متجر دمشق المركزي' },
  plan: { id: '3', name: 'الباقة المميزة', tier: 'featured' },
  term: 'yearly',
  price: 2400000,
  currency: 'SYP',
  startsOn: '2026-01-01',
  endsOn: '2027-01-01',
  status: 'active',
};

const PAYMENT_PLACE = { id: '12', name: 'متجر دمشق المركزي' };

export const PAYMENT_ROW = {
  id: 'p1',
  transactionNumber: 'TRX-100234',
  receiptNumber: 'RCP-5521',
  place: PAYMENT_PLACE,
  amount: 250000,
  currency: 'SYP',
  paymentMethod: 'cash',
  status: 'completed',
  paidOn: '2026-09-20',
  notes: null,
};

export const PAYMENT_SUMMARY = {
  pendingCount: 4,
  completedCount: 512,
  monthTotal: { amount: 8420000, currency: 'SYP' },
  allTimeTotal: { amount: 96300000, currency: 'SYP' },
};

export const PAYMENT_DETAIL = {
  ...PAYMENT_ROW,
  kind: 'upgrade',
  place: {
    ...PAYMENT_PLACE,
    categoryName: 'مواد غذائية',
    ownerName: 'عبيدة',
    ownerPhone: '0931234567',
  },
  subscription: {
    id: 's1',
    plan: { id: '3', name: 'الباقة المميزة', tier: 'featured' },
    term: 'monthly',
    startsOn: '2026-09-20',
    endsOn: '2026-10-20',
  },
  recordedBy: { id: '1', name: 'Obedah' },
  createdAt: '2026-09-20T11:04:00Z',
};

export const PAYMENT_FORM_OPTIONS = {
  places: [
    {
      id: '12',
      name: 'متجر دمشق المركزي',
      currentSubscription: {
        planId: '2',
        planName: 'الباقة الأساسية',
        tier: 'basic',
        endsOn: '2026-10-01',
      },
      currency: 'SYP',
    },
    { id: '40', name: 'صيدلية الشفاء', currentSubscription: null, currency: 'SYP' },
  ],
  plans: [
    {
      id: '1',
      name: 'الباقة المجانية',
      tier: 'free',
      monthlyPrice: 0,
      yearlyPrice: null,
      currency: 'SYP',
    },
    {
      id: '2',
      name: 'الباقة الأساسية',
      tier: 'basic',
      monthlyPrice: 100000,
      yearlyPrice: 960000,
      currency: 'SYP',
    },
    {
      id: '3',
      name: 'الباقة المميزة',
      tier: 'featured',
      monthlyPrice: 250000,
      yearlyPrice: 2400000,
      currency: 'SYP',
    },
  ],
};

export const NEW_PAYMENT = {
  placeId: '12',
  kind: 'upgrade',
  planId: '3',
  term: 'monthly',
  amount: 250000,
  currency: 'SYP',
  paidOn: '2026-09-20',
  startsOn: '2026-09-20',
  notes: 'ترقية إلى المميزة',
};
