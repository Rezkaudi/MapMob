export type ComplaintStatus = 'new' | 'inReview' | 'resolved' | 'rejected';

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  new: 'جديد',
  inReview: 'قيد المراجعة',
  resolved: 'تم الحل',
  rejected: 'مرفوض',
};
