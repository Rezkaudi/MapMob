import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ModeratedReviewStatus } from '../models/review-status';

/** In-memory store behind the mock repository, so moderation and deletes stick. */
export class ReviewMockDatabase {
  private details: ReviewDetail[];

  constructor(seed: readonly ReviewDetail[]) {
    this.details = [...seed];
  }

  listReviews(): readonly Review[] {
    return this.details.map((detail) => detail.review);
  }

  find(id: string): ReviewDetail {
    const detail = this.details.find((candidate) => candidate.review.id === id);
    if (!detail) {
      throw new Error(`لم يتم العثور على التقييم ${id}`);
    }
    return detail;
  }

  acceptReport(id: string): Review {
    return this.settleReport(id, 'hidden');
  }

  rejectReport(id: string): Review {
    return this.settleReport(id, 'published');
  }

  setStatus(id: string, status: ModeratedReviewStatus): Review {
    return this.update(id, { status }).review;
  }

  remove(id: string): void {
    this.details = this.details.filter((detail) => detail.review.id !== id);
  }

  private settleReport(id: string, status: ModeratedReviewStatus): Review {
    if (!this.find(id).report) {
      throw new Error('لا يوجد بلاغ قيد المراجعة لهذا التقييم');
    }
    return this.update(id, { status }, null).review;
  }

  private update(
    id: string,
    reviewPatch: Partial<Review>,
    report: ReviewDetail['report'] = this.find(id).report,
  ): ReviewDetail {
    const current = this.find(id);
    const updated: ReviewDetail = {
      ...current,
      review: { ...current.review, ...reviewPatch },
      report,
    };
    this.details = this.details.map((detail) => (detail.review.id === id ? updated : detail));
    return updated;
  }
}
