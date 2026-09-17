export type ComplaintReason =
  'wrongInformation' | 'closedPlace' | 'inappropriateContent' | 'fakeReview' | 'other';

export const COMPLAINT_REASON_LABELS: Record<ComplaintReason, string> = {
  wrongInformation: 'معلومات خاطئة',
  closedPlace: 'المكان مغلق',
  inappropriateContent: 'محتوى غير لائق',
  fakeReview: 'تقييم مزيف',
  other: 'سبب آخر',
};
