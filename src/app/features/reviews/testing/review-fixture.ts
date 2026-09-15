import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';

export function buildReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 'review-1',
    userName: 'أحمد جمال',
    placeName: 'صيدلية الحياة',
    rating: 5,
    comment: 'المكان ممتاز والخدمة سريعة جداً',
    createdAt: '2024-01-12T00:00:00.000Z',
    status: 'published',
    ...overrides,
  };
}

export function buildReviewDetail(overrides: Partial<ReviewDetail> = {}): ReviewDetail {
  return {
    review: buildReview({
      id: 'review-2',
      userName: 'سارة محمد',
      placeName: 'صيدلية الشفاء',
      rating: 2,
      comment: 'الخدمة كانت بطيئة ولم أجد بعض الأدوية الأساسية في الصيدلية.',
      createdAt: '2026-09-01T17:42:00.000Z',
      status: 'reported',
    }),
    place: {
      referenceNumber: 4920,
      name: 'صيدلية الشفاء',
      categoryName: 'صيدلية',
      governorateName: 'طرطوس',
      areaName: 'طرطوس المدينة',
    },
    reviewer: {
      name: 'سارة محمد',
      memberSince: '2024-01-05T00:00:00.000Z',
      reviewCount: 14,
      isPhoneVerified: true,
    },
    report: {
      reporterName: 'إدارة صيدلية الشفاء',
      reason: 'معلومات غير صحيحة وإساءة',
      notes: 'العميلة لم تقم بزيارة الفرع والأدوية المذكورة متوفرة دائماً.',
    },
    ...overrides,
  };
}
