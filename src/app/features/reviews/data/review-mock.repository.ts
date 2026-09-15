import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ReviewQuery } from '../models/review-query';
import { ModeratedReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';
import { ReviewMockDatabase } from './review-mock-database';
import { filterReviews, queryReviews, summarizeReviews } from './review-mock-query';
import { ReviewRepository } from './review.repository';
import { buildReviewsCsvFile } from './reviews-csv';

@Injectable()
export class ReviewMockRepository implements ReviewRepository {
  private readonly database = inject(ReviewMockDatabase);
  private readonly clock = inject(CLOCK);

  getReviews(query: ReviewQuery): Observable<PagedResult<Review>> {
    return mockRequest(() => queryReviews(this.database.listReviews(), query));
  }

  getSummary(): Observable<ReviewSummary> {
    return mockRequest(() => summarizeReviews(this.database.listReviews(), this.clock()));
  }

  getReviewDetail(id: string): Observable<ReviewDetail> {
    return mockRequest(() => this.database.find(id));
  }

  acceptReport(id: string): Observable<Review> {
    return mockRequest(() => this.database.acceptReport(id));
  }

  rejectReport(id: string): Observable<Review> {
    return mockRequest(() => this.database.rejectReport(id));
  }

  setReviewStatus(id: string, status: ModeratedReviewStatus): Observable<Review> {
    return mockRequest(() => this.database.setStatus(id, status));
  }

  deleteReview(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  exportReviews(query: ReviewQuery): Observable<Blob> {
    return mockRequest(() =>
      buildReviewsCsvFile(filterReviews(this.database.listReviews(), query)),
    );
  }
}
