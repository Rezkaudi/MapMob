import { ComplaintDetail } from '../models/complaint-detail';

export function buildComplaintDetail(overrides: Partial<ComplaintDetail> = {}): ComplaintDetail {
  return {
    id: 'complaint-1',
    reference: '#1023',
    reason: 'wrongInformation',
    status: 'new',
    reportedOn: '2026-09-09',
    reporter: {
      id: 'user-1',
      name: 'سارة علي',
      email: 'sara.r@example.com',
      phone: '+966 54 123 4567',
    },
    place: {
      id: 'place-4',
      name: 'مطعم الشام',
      categoryName: 'مطاعم',
      address: 'طرطوس،طرطوس المدينة',
      rating: 4.6,
      reviewCount: 120,
      imageUrl: 'assets/images/place-restaurant-hall.jpg',
    },
    description: 'معلومات المكان غير صحيحة',
    userDetails: 'ذهبت إلى الموقع مرتين متتاليتين خلال ساعات العمل المعتادة ولم أجد المطعم مفتوحاً',
    attachmentUrls: ['assets/images/complaint-closed-storefront.jpg'],
    adminNotes: '',
    ...overrides,
  };
}
