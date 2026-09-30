import { DeliveryLink } from '../../../shared/models/delivery-link';
import { StoreProfile } from '../models/store-profile';
import { StoreWorkingDay } from '../models/store-working-day';
import { WeekDay } from '../models/week-day';

const OPEN_DAYS: readonly WeekDay[] = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
];

/** Saturday to Thursday 09:00–23:00, Friday off, as the design draws the week. */
export function buildWeek(): StoreWorkingDay[] {
  return [
    ...OPEN_DAYS.map((day) => ({ day, isOpen: true, openTime: '09:00', closeTime: '23:00' })),
    { day: 'friday', isOpen: false, openTime: null, closeTime: null },
  ];
}

/** BeeOrder switched on with its link, Talabat off and never set up. */
export function buildDeliveryLinks(): DeliveryLink[] {
  return [
    {
      platform: { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
      isEnabled: true,
      storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
    },
    {
      platform: { id: '3', name: 'طلبات', latinName: 'talabat', logoUrl: null },
      isEnabled: false,
      storeUrl: null,
    },
  ];
}

export function buildStoreProfile(overrides: Partial<StoreProfile> = {}): StoreProfile {
  return {
    name: 'صيدلية الحياة',
    publicUrl: 'https://mapmob.app/store/alhayat-pharmacy',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية.',
    coverImageUrl: 'https://cdn.mapmob.sy/places/12/cover.jpg',
    mainCategory: { id: '3', name: 'صيدليات' },
    subCategory: { id: '14', name: 'صيدليات ومراكز صحية' },
    contact: {
      phone: '+963 944 123 456',
      email: 'contact@alhayat-pharmacy.sy',
      whatsapp: '+963 944 123 456',
      facebook: 'https://facebook.com/alhayatpharmacy',
      instagram: 'https://instagram.com/alhayatpharmacy',
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
    workingHours: buildWeek(),
    deliveryLinks: buildDeliveryLinks(),
    ...overrides,
  };
}
