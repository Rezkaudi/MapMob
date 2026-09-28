import type { OfferItem } from '../../../../shared/models/offer-item';
import type { PlaceStatusCounts } from '../../../places/models/place-status-counts';

const STORAGE = 'https://api.mapmob.com.co/storage';

const PLAN = { id: '2', name: 'الباقة الأساسية', tier: 'basic' };

export const PLACE_ROW = {
  id: '12',
  code: 'PL-0012',
  name: 'متجر دمشق المركزي',
  logoUrl: `${STORAGE}/places/logos/12.png`,
  category: { id: '1', name: 'مواد غذائية' },
  governorate: { id: '1', name: 'دمشق' },
  rating: 4.6,
  reviewCount: 84,
  status: 'active',
  planTier: 'basic',
  createdAt: '2026-09-22T19:01:50Z',
};

export const PLACE_STATUS_COUNTS = {
  all: 412,
  active: 351,
  suspended: 24,
  pending: 37,
} satisfies PlaceStatusCounts;

const OPEN_DAY = { isOpen: true, openTime: '09:00', closeTime: '18:00' };
const CLOSED_DAY = { isOpen: false, openTime: null, closeTime: null };

export const PLACE_DETAIL = {
  id: '12',
  code: 'PL-0012',
  name: 'متجر دمشق المركزي',
  status: 'active',
  description: 'متجر لبيع المواد الغذائية والخضار الطازجة',
  logoUrl: `${STORAGE}/places/logos/12.png`,
  mainCategory: { id: '1', name: 'مواد غذائية' },
  subCategory: { id: '7', name: 'سوبر ماركت' },
  rating: 4.6,
  reviewCount: 84,
  isOpenNow: true,
  owner: { name: 'عبيدة', phone: '0931234567', extraPhone: null },
  contact: {
    phone: '0931234567',
    extraPhone: null,
    website: 'https://example.com',
    whatsapp: '0931234567',
    facebook: 'https://facebook.com/damascus.store',
    instagram: null,
    telegram: null,
  },
  location: {
    governorate: { id: '1', name: 'دمشق' },
    area: { id: '2', name: 'المزة' },
    address: 'شارع الجلاء، بناء 4',
    latitude: 33.5138,
    longitude: 36.2765,
  },
  workingHours: [
    { day: 'saturday', ...CLOSED_DAY },
    { day: 'sunday', ...OPEN_DAY },
    { day: 'monday', ...OPEN_DAY },
    { day: 'tuesday', ...OPEN_DAY },
    { day: 'wednesday', ...OPEN_DAY },
    { day: 'thursday', ...OPEN_DAY },
    { day: 'friday', ...CLOSED_DAY },
  ],
  subscription: { plan: PLAN, status: 'active', startsOn: '2026-01-01', endsOn: '2027-01-01' },
  images: [
    { id: '31', url: `${STORAGE}/places/12/gallery/31.jpg` },
    { id: '32', url: `${STORAGE}/places/12/gallery/32.jpg` },
  ],
  videos: [
    {
      id: '40',
      url: `${STORAGE}/places/12/videos/40.mp4`,
      posterUrl: `${STORAGE}/places/12/videos/40.jpg`,
      durationSeconds: 84,
    },
  ],
  products: [
    {
      id: '5',
      name: 'مرتديلا',
      price: 12000,
      currency: 'SYP',
      imageUrl: `${STORAGE}/products/5.png`,
      isAvailable: true,
      orderUrl: null,
    },
  ],
  offers: [
    {
      id: '2',
      title: 'خصم الشهر',
      description: 'خصم 20% على كل المنتجات',
      startsOn: '2026-09-22',
      endsOn: '2026-12-22',
      status: 'active',
      imageUrl: `${STORAGE}/offers/2.png`,
    },
  ],
  createdAt: '2026-09-22T19:01:50Z',
  updatedAt: '2026-09-25T08:30:00Z',
};

export const PLACE_STATUS_REQUEST = { ids: ['12', '40'], status: 'suspended' };

export const PLACE_DELETE_REQUEST = { ids: ['12', '40'] };

export const PLACE_WRITE_FORM = {
  name: 'متجر دمشق المركزي',
  ownerName: 'عبيدة',
  ownerPhone: '0931234567',
  mainCategoryId: '1',
  subCategoryId: '7',
  governorateId: '1',
  areaId: '2',
  address: 'شارع الجلاء، بناء 4',
  latitude: 33.5138,
  longitude: 36.2765,
  phone: '0931234567',
  website: 'https://example.com',
  whatsapp: '0931234567',
  description: 'متجر لبيع المواد الغذائية',
  planId: '2',
  status: 'pending',
  'workingHours[0][day]': 'saturday',
  'workingHours[0][isOpen]': false,
  'workingHours[1][day]': 'sunday',
  'workingHours[1][isOpen]': true,
  'workingHours[1][openTime]': '09:00',
  'workingHours[1][closeTime]': '18:00',
  logo: '@logo.png',
  'images[]': ['@front.jpg', '@inside.jpg'],
  'videos[]': ['@tour.mp4'],
  'products[0][name]': 'مرتديلا',
  'products[0][price]': 12000,
  'products[0][currency]': 'SYP',
  'products[0][isAvailable]': true,
  'products[0][image]': '@product.png',
};

export const PLACE_UPDATE_FORM = {
  ...PLACE_WRITE_FORM,
  'keptImageIds[]': ['31'],
  'keptVideoIds[]': [],
  'products[0][id]': '5',
  isLogoRemoved: false,
};

export const PLACE_FORM_OPTIONS = {
  mainCategories: [
    { id: '1', name: 'مواد غذائية', subCategories: [{ id: '7', name: 'سوبر ماركت' }] },
    { id: '2', name: 'مطاعم', subCategories: [{ id: '9', name: 'وجبات سريعة' }] },
  ],
  governorates: [{ id: '1', name: 'دمشق', areas: [{ id: '2', name: 'المزة' }] }],
  plans: [
    { id: '1', name: 'الباقة المجانية', tier: 'free' },
    PLAN,
    { id: '3', name: 'الباقة المميزة', tier: 'featured' },
  ],
};

export const PLACE_OFFER_ITEMS = [
  { id: '5', name: 'مرتديلا', price: 12000, currency: 'SYP' },
  { id: '9', name: 'جبنة بلدية', price: 30000, currency: 'SYP' },
] satisfies OfferItem[];
