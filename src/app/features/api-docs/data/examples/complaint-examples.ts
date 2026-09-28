import type { ComplaintReview } from '../../../complaints/models/complaint-review';
import type { ComplaintSummary } from '../../../complaints/models/complaint-summary';

export const COMPLAINT_ROW = {
  id: '1023',
  reference: '#1023',
  reason: 'wrongInformation',
  status: 'new',
  reportedAt: '2026-09-26T14:20:00Z',
  reporter: { id: '5', name: 'أحمد خليل', email: 'ahmad@example.com', phone: '963936318327' },
  place: {
    id: '12',
    code: 'PL-0012',
    name: 'متجر دمشق المركزي',
    categoryName: 'مواد غذائية',
    address: 'شارع الجلاء، بناء 4',
    rating: 4.6,
    reviewCount: 84,
    imageUrl: 'https://api.mapmob.com.co/storage/places/logos/12.png',
  },
};

export const COMPLAINT_SUMMARY = {
  totalCount: 63,
  newCount: 11,
  inReviewCount: 8,
  resolvedCount: 38,
  rejectedCount: 6,
} satisfies ComplaintSummary;

export const COMPLAINT_DETAIL = {
  ...COMPLAINT_ROW,
  description: 'رقم الهاتف غير صحيح',
  userDetails: 'اتصلت بالرقم ولم يرد أحد',
  attachmentUrls: ['https://api.mapmob.com.co/storage/complaints/1023/1.jpg'],
  adminNotes: null,
};

export const COMPLAINT_REVIEW = {
  status: 'resolved',
  adminNotes: 'تم تحديث رقم الهاتف',
} satisfies ComplaintReview;
