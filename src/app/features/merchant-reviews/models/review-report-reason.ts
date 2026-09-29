export type ReviewReportReason = 'abusive' | 'fake' | 'unrelated' | 'promotional' | 'other';

/** In the order the report dialog lists them. */
export const REVIEW_REPORT_REASON_LABEL: Record<ReviewReportReason, string> = {
  abusive: 'المراجعة تحتوي على إساءة أو ألفاظ نابية',
  fake: 'المراجعة غير صحيحة أو تجربة وهمية لم تحدث',
  unrelated: 'المراجعة لا تتعلق بالمكان أو تخص متجر آخر',
  promotional: 'محتوى ترويجي أو روابط مضللة',
  other: 'سبب آخر',
};
