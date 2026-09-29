/** Where the owner's own report on a review stands; `none` until they send one. */
export type OwnerReviewReportStatus = 'none' | 'pending' | 'accepted' | 'rejected';

export const OWNER_REVIEW_REPORT_STATUS_LABEL: Record<OwnerReviewReportStatus, string> = {
  none: 'غير مبلغ عنه',
  pending: 'مبلغ عنه (قيد المراجعة)',
  accepted: 'مخفية بعد البلاغ',
  rejected: 'رُفض البلاغ',
};
