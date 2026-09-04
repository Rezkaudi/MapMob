export type ReviewStatus = 'published' | 'reported' | 'hidden';

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  published: 'منشور',
  reported: 'مبلغ عنه',
  hidden: 'مخفي',
};
