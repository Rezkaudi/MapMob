import { PlaceDetail } from '../models/place-detail';

export function createPlaceDetail(overrides: Partial<PlaceDetail> = {}): PlaceDetail {
  return {
    id: 'place-1',
    code: '1024',
    name: 'صيدلية الحياة',
    status: 'active',
    description: 'صيدلية الحياة تقدم مجموعة واسعة من الأدوية.',
    mainCategory: 'صيدليات',
    subCategory: 'صيدليات',
    images: [],
    owner: { name: 'أحمد عبدالله', phone: '096077789' },
    subscription: { package: 'premium', status: 'active', renewsAt: '2024-10-24T00:00:00.000Z' },
    activity: { addedAt: '2024-10-24T00:00:00.000Z', updatedLabel: 'منذ يومين' },
    contact: {
      phone: '+966 50 123 4567',
      whatsapp: '+966 50 123 4567',
      facebook: 'https://facebook.com/alhayatpharmacy',
      instagram: 'https://instagram.com/alhayatpharmacy',
    },
    location: {
      city: 'طرطوس',
      address: 'طرطوس ، شارع الثورة، بجانب',
      latitude: 34.889,
      longitude: 35.886,
    },
    workingHours: [
      { days: 'الأحد - الخميس', hours: '09:00 AM - 11:00 PM', isToday: false },
      { days: 'السبت (اليوم)', hours: '10:00 AM - 10:00 PM', isToday: true },
    ],
    isOpenNow: true,
    ...overrides,
  };
}
