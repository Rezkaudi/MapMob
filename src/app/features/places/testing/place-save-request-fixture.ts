import { PlaceSaveRequest } from '../models/place-save-request';
import { createDefaultWeek } from '../models/working-day';

export function buildPlaceSaveRequest(overrides: Partial<PlaceSaveRequest> = {}): PlaceSaveRequest {
  return {
    value: {
      name: 'صيدلية الأمل',
      ownerName: 'أحمد',
      ownerPhone: '0931111111',
      ownerEmail: 'owner@example.com',
      ownerPassword: 'secret-123',
      mainCategory: 'pharmacy',
      subCategory: '',
      city: 'tartous Governorate',
      region: 'tartus city',
      address: 'شارع الثورة',
      latitude: 34.89,
      longitude: 35.88,
      phone: '0932222222',
      extraPhone: '',
      website: '',
      whatsapp: '0932222222',
      useMainPhoneForWhatsapp: true,
      facebook: '',
      instagram: '',
      telegram: '',
      description: 'صيدلية مناوبة',
      package: 'free',
      status: 'active',
      deliveryLinks: [],
    },
    week: createDefaultWeek(),
    images: [],
    videos: [],
    products: [],
    previousPackage: null,
    previousOwner: null,
    ...overrides,
  };
}
