import { ComplaintStatus } from './complaint-status';

/** What the admin saves from the "مراجعة البلاغ وتحديث حالته" card. */
export interface ComplaintReview {
  readonly status: ComplaintStatus;
  readonly adminNotes: string;
}
