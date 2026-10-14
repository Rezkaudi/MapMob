import { Complaint } from '../models/complaint';
import { ComplaintStatus } from '../models/complaint-status';
import { ComplaintSummary } from '../models/complaint-summary';

export function summarizeComplaints(complaints: readonly Complaint[]): ComplaintSummary {
  const countOf = (status: ComplaintStatus) =>
    complaints.filter((complaint) => complaint.status === status).length;
  return {
    totalCount: complaints.length,
    newCount: countOf('new'),
    inReviewCount: countOf('inReview'),
    resolvedCount: countOf('resolved'),
    rejectedCount: countOf('rejected'),
  };
}
