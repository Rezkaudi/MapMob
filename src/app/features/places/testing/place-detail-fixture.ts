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
    images: ['assets/images/place-cover.jpg', 'assets/images/place-shelf.jpg'],
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
    products: Array.from({ length: 2 }, (_, index) => ({
      id: `product-${index + 1}`,
      name: 'سيروم تحت العين',
      price: 200,
      currency: 'ل.س',
      imageUrl: 'assets/images/product-facial.jpg',
      isAvailable: true,
      orderUrl: '',
    })),
    offers: Array.from({ length: 3 }, (_, index) => ({
      id: `offer-${index + 1}`,
      title: 'خصم 20 % على جميع المنتجات',
      description: 'خصم خاص لفترة محدودة على كافة أصناف المكملات الغذائية',
      dateRange: '01 - 15 سبتمبر 2026',
      imageUrl: 'assets/images/offer-cosmetics.jpg',
      isActive: true,
    })),
    videos: [
      {
        id: 'video-1',
        url: '',
        posterUrl: 'assets/images/place-cover.jpg',
        duration: '01:24',
      },
    ],
    isOpenNow: true,
    ...overrides,
  };
}
