import { toPlaceDetail } from './live-place-detail-mapping';
import { LivePlaceDetail } from './live-place-detail';

// Sunday 11 October 2026, 10:00 UTC.
const NOW = new Date('2026-10-11T10:00:00Z');

const LIVE_DETAIL: LivePlaceDetail = {
  id: '1',
  code: 'PL-0001',
  name: 'متجر دمشق',
  publicUrl: null,
  status: 'inactive',
  description: null,
  logoUrl: null,
  mainCategory: { id: '1', name: 'مطاعم' },
  subCategory: null,
  isOpenNow: true,
  owner: { name: 'عبيدة', phone: '0999', extraPhone: null },
  contact: {
    phone: '0935',
    extraPhone: null,
    website: 'https://happy.com',
    whatsapp: null,
    facebook: null,
    instagram: null,
    telegram: null,
  },
  location: {
    governorate: { id: '1', name: 'دمشق' },
    area: { id: '1', name: 'داريا' },
    address: 'شارع الجمهورية',
    latitude: 34.859,
    longitude: 35.8836,
  },
  workingHours: [
    { day: 0, isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 1, isOpen: false, openTime: null, closeTime: null },
  ],
  subscription: {
    plan: { id: '1', name: 'الذهبية', tier: 'featured' },
    status: 'active',
    startsOn: '2026-10-04',
    endsOn: '2026-11-03',
  },
  images: [{ id: '1', url: 'https://api.test/1.jpg' }],
  videos: [{ id: '5', url: 'https://api.test/5.mp4', posterUrl: null, duration: null }],
  products: [
    {
      id: '1',
      name: 'لحمة',
      price: 100,
      currency: 'SYP',
      imageUrl: null,
      isAvailable: false,
      orderUrl: null,
    },
  ],
  offers: [
    {
      id: '1',
      title: 'خصم',
      description: null,
      startsOn: '2026-09-22',
      endsOn: '2026-12-22',
      status: 'active',
      imageUrl: null,
    },
  ],
  deliveryLinks: [{ platform: 'tawseel', isEnabled: true, storeUrl: 'https://tawseel.com' }],
  createdAt: '2026-10-03T19:59:36+00:00',
  updatedAt: '2026-10-09T10:00:00+00:00',
};

describe('toPlaceDetail', () => {
  const detail = toPlaceDetail(LIVE_DETAIL, NOW);

  it('keeps the plain fields and fills missing text with empty strings', () => {
    expect(detail.id).toBe('1');
    expect(detail.status).toBe('suspended');
    expect(detail.description).toBe('');
    expect(detail.publicUrl).toBe('');
    expect(detail.mainCategory).toBe('مطاعم');
    expect(detail.subCategory).toBe('');
    expect(detail.owner).toEqual({ name: 'عبيدة', phone: '0999', extraPhone: '' });
    expect(detail.contact.whatsapp).toBe('');
    expect(detail.location).toEqual({
      city: 'دمشق',
      region: 'داريا',
      address: 'شارع الجمهورية',
      latitude: 34.859,
      longitude: 35.8836,
    });
    expect(detail.isOpenNow).toBe(true);
  });

  it('lists only the open days, day 0 being Sunday, and marks today', () => {
    expect(detail.workingHours).toEqual([
      { days: 'الأحد (اليوم)', hours: '09:00 - 18:00', isToday: true },
    ]);
  });

  it('reads the subscription plan and when it ends', () => {
    expect(detail.subscription).toEqual({
      package: 'premium',
      status: 'active',
      renewsAt: '2026-11-03',
    });
  });

  it('gives a free plan with no end date when the place has no subscription', () => {
    expect(toPlaceDetail({ ...LIVE_DETAIL, subscription: null }, NOW).subscription).toEqual({
      package: 'free',
      status: 'suspended',
      renewsAt: '',
    });
  });

  it('turns the media, products, offers and delivery links into the page shapes', () => {
    expect(detail.images).toEqual(['https://api.test/1.jpg']);
    expect(detail.videos).toEqual([
      { id: '5', url: 'https://api.test/5.mp4', posterUrl: '', duration: '' },
    ]);
    expect(detail.products).toEqual([
      {
        id: '1',
        name: 'لحمة',
        price: 100,
        currency: 'SYP',
        imageUrl: '',
        isAvailable: false,
        orderUrl: '',
      },
    ]);
    expect(detail.offers).toEqual([
      {
        id: '1',
        title: 'خصم',
        description: '',
        dateRange: '22 سبتمبر 2026 - 22 ديسمبر 2026',
        imageUrl: '',
        isActive: true,
      },
    ]);
    expect(detail.deliveryLinks).toEqual([
      {
        platform: { id: 'tawseel', name: 'tawseel', latinName: 'tawseel', logoUrl: null },
        isEnabled: true,
        storeUrl: 'https://tawseel.com',
      },
    ]);
  });

  it('says when the place was added and how long ago it changed', () => {
    expect(detail.activity).toEqual({
      addedAt: '2026-10-03T19:59:36+00:00',
      updatedLabel: 'منذ يومين',
    });
  });
});
