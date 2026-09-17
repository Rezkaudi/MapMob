import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintStatus } from '../models/complaint-status';
import { ComplaintSummary } from '../models/complaint-summary';

/** In-memory store behind the mock repository, so saved reviews and deletes stick. */
export class ComplaintMockDatabase {
  private complaints: ComplaintDetail[];

  constructor(seed: readonly ComplaintDetail[]) {
    this.complaints = [...seed];
  }

  list(): readonly ComplaintDetail[] {
    return this.complaints;
  }

  find(id: string): ComplaintDetail {
    const complaint = this.complaints.find((candidate) => candidate.id === id);
    if (!complaint) {
      throw new Error(`لم يتم العثور على البلاغ ${id}`);
    }
    return complaint;
  }

  summarize(): ComplaintSummary {
    const countOf = (status: ComplaintStatus) =>
      this.complaints.filter((complaint) => complaint.status === status).length;
    return {
      totalCount: this.complaints.length,
      newCount: countOf('new'),
      inReviewCount: countOf('inReview'),
      resolvedCount: countOf('resolved'),
      rejectedCount: countOf('rejected'),
    };
  }

  saveReview(id: string, review: ComplaintReview): ComplaintDetail {
    const updated = { ...this.find(id), ...review };
    this.complaints = this.complaints.map((complaint) =>
      complaint.id === id ? updated : complaint,
    );
    return updated;
  }

  remove(id: string): void {
    this.complaints = this.complaints.filter((complaint) => complaint.id !== id);
  }
}
