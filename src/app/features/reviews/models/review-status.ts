export type ReviewStatus = 'published' | 'reported' | 'hidden';

/** A report is settled by accepting or rejecting it, never by setting "reported" by hand. */
export type ModeratedReviewStatus = Exclude<ReviewStatus, 'reported'>;

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  published: 'منشور',
  reported: 'مبلغ عنه',
  hidden: 'مخفي',
};
