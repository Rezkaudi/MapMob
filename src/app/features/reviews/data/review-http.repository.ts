import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ReviewQuery } from '../models/review-query';
import { ModeratedReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';
import { toReviewQueryParams } from './review-query-params';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewHttpRepository implements ReviewRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly reviewsUrl = `${inject(API_BASE_URL)}/reviews`;

  getReviews(query: ReviewQuery): Observable<PagedResult<Review>> {
    return this.httpClient.get<PagedResult<Review>>(this.reviewsUrl, {
      params: toReviewQueryParams(query),
    });
  }

  getSummary(): Observable<ReviewSummary> {
    return this.httpClient.get<ReviewSummary>(`${this.reviewsUrl}/summary`);
  }

  getReviewDetail(id: string): Observable<ReviewDetail> {
    return this.httpClient.get<ReviewDetail>(`${this.reviewsUrl}/${id}`);
  }

  acceptReport(id: string): Observable<Review> {
    return this.httpClient.post<Review>(`${this.reviewsUrl}/${id}/report/accept`, null);
  }

  rejectReport(id: string): Observable<Review> {
    return this.httpClient.post<Review>(`${this.reviewsUrl}/${id}/report/reject`, null);
  }

  setReviewStatus(id: string, status: ModeratedReviewStatus): Observable<Review> {
    return this.httpClient.patch<Review>(`${this.reviewsUrl}/${id}/status`, { status });
  }

  deleteReview(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.reviewsUrl}/${id}`);
  }

  exportReviews(query: ReviewQuery): Observable<Blob> {
    return this.httpClient.get(`${this.reviewsUrl}/export`, {
      params: toReviewQueryParams(query),
      responseType: 'blob',
    });
  }
}
