import type { AuthenticatedUser } from '../../../auth/models/authenticated-user';
import type { Credentials } from '../../../auth/models/credentials';
import type { NewPassword } from '../../../merchant-auth/models/new-password';
import type { PasswordResetGrant } from '../../../merchant-auth/models/password-reset-grant';
import type { ResetCodeCheck } from '../../../merchant-auth/models/reset-code-check';
import type { MerchantOverview } from '../../../merchant-overview/models/merchant-overview';
import type { StorePerformance } from '../../../merchant-overview/models/store-performance';
import type { StoreProfile } from '../../../merchant-store/models/store-profile';
import type { MerchantProduct } from '../../../merchant-products/models/merchant-product';
import type { MerchantProductCatalog } from '../../../merchant-products/models/merchant-product-catalog';
import type { OwnerNotification } from '../../../merchant-notifications/models/owner-notification';
import type { AccountProfileDraft } from '../../../settings/models/account-profile-draft';

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

export const CURRENT_OWNER = {
  id: SIGNED_IN_OWNER.id,
  name: SIGNED_IN_OWNER.name,
  role: SIGNED_IN_OWNER.role,
  avatarUrl: SIGNED_IN_OWNER.avatarUrl,
};

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

export const OWNER_PLACE = {
  name: 'صيدلية الحياة',
  publicUrl: 'https://mapmob.app/store/alhayat-pharmacy',
  description: 'صيدلية تقدم الأدوية والمستلزمات الطبية ومنتجات العناية الشخصية.',
  coverImageUrl: 'https://cdn.mapmob.sy/places/12/cover.jpg',
  mainCategory: { id: '3', name: 'صيدليات' },
  subCategory: { id: '14', name: 'صيدليات ومراكز صحية' },
  contact: {
    phone: '+963 944 123 456',
    email: 'contact@alhayat-pharmacy.sy',
    whatsapp: '+963 944 123 456',
    facebook: 'https://facebook.com/alhayatpharmacy',
    instagram: null,
    telegram: 'https://t.me/alhayatpharmacy',
  },
  location: {
    governorate: { id: '6', name: 'طرطوس' },
    area: { id: '41', name: 'طرطوس المدينة' },
    address: 'شارع الثورة، بجانب المركز الثقافي، بناء رقم 12',
    latitude: 34.8959,
    longitude: 35.8866,
  },
  isOpen24Hours: false,
  workingHours: [
    { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'friday', isOpen: false, openTime: null, closeTime: null },
  ],
  deliveryLinks: [
    {
      platform: {
        id: '1',
        name: 'بي أوردر',
        latinName: 'BeeOrder',
        logoUrl: 'https://cdn.mapmob.sy/delivery-platforms/1.png',
      },
      isEnabled: true,
      storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
    },
    {
      platform: { id: '3', name: 'طلبات', latinName: 'talabat', logoUrl: null },
      isEnabled: false,
      storeUrl: null,
    },
  ],
} satisfies StoreProfile;

export const OWNER_PLACE_UPDATE_FORM = {
  name: 'صيدلية الحياة',
  description: 'صيدلية تقدم الأدوية والمستلزمات الطبية ومنتجات العناية الشخصية.',
  phone: '+963 944 123 456',
  email: 'contact@alhayat-pharmacy.sy',
  whatsapp: '+963 944 123 456',
  facebook: 'https://facebook.com/alhayatpharmacy',
  telegram: 'https://t.me/alhayatpharmacy',
  address: 'شارع الثورة، بجانب المركز الثقافي، بناء رقم 12',
  latitude: 34.8959,
  longitude: 35.8866,
  isOpen24Hours: false,
  'workingHours[0][day]': 'saturday',
  'workingHours[0][isOpen]': true,
  'workingHours[0][openTime]': '09:00',
  'workingHours[0][closeTime]': '23:00',
  'workingHours[6][day]': 'friday',
  'workingHours[6][isOpen]': false,
  'deliveryLinks[0][platformId]': '1',
  'deliveryLinks[0][isEnabled]': true,
  'deliveryLinks[0][storeUrl]': 'https://beeorder.sy/store/alhayat-pharma',
  'deliveryLinks[1][platformId]': '3',
  'deliveryLinks[1][isEnabled]': false,
  cover: '@cover.jpg',
};

export const OWNER_PRODUCT = {
  id: '5',
  name: 'مرطب dove',
  price: 200,
  currency: 'SYP',
  imageUrl: 'https://cdn.mapmob.sy/storage/products/5.png',
  isAvailable: true,
  orderUrl: null,
  updatedAt: '2026-09-21T10:15:00Z',
} satisfies MerchantProduct;

export const OWNER_PRODUCT_CATALOG = {
  plan: { id: '1', name: 'الباقة المجانية' },
  productLimit: 3,
  items: [
    OWNER_PRODUCT,
    {
      id: '6',
      name: 'سيروم فيتامين C',
      price: 350,
      currency: 'SYP',
      imageUrl: null,
      isAvailable: false,
      orderUrl: 'https://shop.example.com/serum',
      updatedAt: '2026-09-14T08:00:00Z',
    },
  ],
} satisfies MerchantProductCatalog;

export const OWNER_PRODUCT_FORM = {
  name: 'مرطب dove',
  price: 200,
  currency: 'SYP',
  isAvailable: true,
  image: '@product.png',
};

export const OWNER_PRODUCT_UPDATE_FORM = {
  name: 'مرطب dove',
  price: 250,
  currency: 'SYP',
  isAvailable: true,
  orderUrl: 'https://shop.example.com/dove',
  isImageRemoved: false,
};

export const OWNER_NOTIFICATION = {
  id: 'owner-notification-1',
  category: 'offers',
  title: 'لم تتم الموافقة على العرض الترويجي',
  body: 'لم تتم الموافقة على العرض لمخالفته شروط الوصف الواضح للمنتجات المشمولة. يرجى تعديل الشروط وإعادة الإرسال.',
  receivedAt: '2026-09-10T09:00:00Z',
  isRead: false,
  subjectId: 'offer-1',
} satisfies OwnerNotification;

export const OWNER_ACCOUNT = {
  fullName: 'محمد احمد',
  email: 'rawabi@gmail.com',
} satisfies AccountProfileDraft;
