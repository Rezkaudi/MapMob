import { ComplaintReason } from './complaint-reason';
import { ComplaintReporter } from './complaint-reporter';
import { ComplaintStatus } from './complaint-status';
import { ReportedPlace } from './reported-place';

export interface Complaint {
  readonly id: string;
  /** What the admin sees, e.g. "#1023". */
  readonly reference: string;
  readonly reason: ComplaintReason;
  readonly status: ComplaintStatus;
  /** A calendar day written `yyyy-mm-dd`, like the rest of the codebase's domain dates. */
  readonly reportedOn: string;
  readonly reporter: ComplaintReporter;
  readonly place: ReportedPlace;
}
