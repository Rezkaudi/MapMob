import { BillingCycle } from '../../../shared/models/billing-cycle';

/** "150,000 ل.س / شهرياً" */
export const TERM_ADVERB: Record<BillingCycle, string> = { monthly: 'شهرياً', yearly: 'سنوياً' };
/** The "المدة" column: "شهرية". */
export const TERM_LABEL: Record<BillingCycle, string> = { monthly: 'شهرية', yearly: 'سنوية' };
/** The renewal dialog's "مدة التجديد": "شهري". */
export const RENEWAL_TERM_LABEL: Record<BillingCycle, string> = { monthly: 'شهري', yearly: 'سنوي' };
