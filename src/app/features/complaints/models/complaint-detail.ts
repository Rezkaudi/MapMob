import { Complaint } from './complaint';

export interface ComplaintDetail extends Complaint {
  /** The reporter's one-line summary, shown in the grey box. */
  readonly description: string;
  readonly userDetails: string;
  readonly attachmentUrls: readonly string[];
  readonly adminNotes: string;
}
