import type { ReviewSummary } from '../../../reviews/models/review-summary';

export const REVIEW_ROW = {
  id: 'r1',
  user: { id: '5', name: 'أحمد خليل' },
  place: { id: '402', name: 'مطعم الشام' },
  rating: 2,
  comment: 'الخدمة بطيئة جداً',
  status: 'reported',
  createdAt: '2026-09-21T09:30:00Z',
};

export const REVIEW_SUMMARY = {
  totalCount: 1284,
  averageRating: 4.3,
  newCount: 37,
  reportedCount: 6,
} satisfies ReviewSummary;

export const REVIEW_DETAIL = {
  ...REVIEW_ROW,
  place: {
    id: '402',
    code: 'PL-0402',
    name: 'مطعم الشام',
    category: { id: '2', name: 'مطاعم' },
    governorate: { id: '1', name: 'دمشق' },
    area: { id: '2', name: 'المزة' },
  },
  user: {
    id: '5',
    name: 'أحمد خليل',
    createdAt: '2026-01-14T08:00:00Z',
    reviewCount: 6,
    isPhoneVerified: true,
  },
  openReports: [
    {
      id: 'rr1',
      reporter: { type: 'place', id: '402', name: 'مطعم الشام' },
      reason: 'تقييم مزيف',
      notes: 'هذا الشخص لم يزر المطعم',
      createdAt: '2026-09-22T07:15:00Z',
    },
  ],
};
