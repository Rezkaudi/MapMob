import { StoreProfile } from '../models/store-profile';

/** The pharmacy the "بيانات المتجر" frame is drawn with. */
export const STORE_PROFILE_SEED: StoreProfile = {
  name: 'صيدلية الحياة',
  publicUrl: 'https://mapmob.app/store/alhayat-pharmacy',
  description:
    'صيدلية الحياة تقدم مجموعة واسعة من الأدوية والمستلزمات الطبية ومنتجات العناية الشخصية والتجميل. نحرص على تقديم أفضل خدمة صيدلانية مع استشارات طبية متخصصة من قبل صيادلة مؤهلين.',
  coverImageUrl: 'assets/images/store-cover-pharmacy.jpg',
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
      platform: { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
      isEnabled: true,
      storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
    },
    {
      platform: { id: '2', name: 'يلا غو', latinName: 'yallago', logoUrl: null },
      isEnabled: true,
      storeUrl: 'https://yallago.sy/store/alhayat-pharma',
    },
    {
      platform: { id: '3', name: 'طلبات', latinName: 'talabat', logoUrl: null },
      isEnabled: false,
      storeUrl: null,
    },
  ],
};
