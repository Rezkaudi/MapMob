import { Complaint } from '../models/complaint';
import { COMPLAINT_REASON_LABELS } from '../models/complaint-reason';
import { COMPLAINT_STATUS_LABELS } from '../models/complaint-status';

export interface ComplaintRow {
  readonly complaint: Complaint;
  readonly reasonLabel: string;
  readonly statusLabel: string;
}

export function buildComplaintRow(complaint: Complaint): ComplaintRow {
  return {
    complaint,
    reasonLabel: COMPLAINT_REASON_LABELS[complaint.reason],
    statusLabel: COMPLAINT_STATUS_LABELS[complaint.status],
  };
}
