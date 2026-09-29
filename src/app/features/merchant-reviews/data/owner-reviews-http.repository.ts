import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { ReviewReport } from '../models/review-report';
import { toOwnerReviewQueryParams } from './owner-review-query-params';
import { OwnerReviewsRepository } from './owner-reviews.repository';

@Injectable()
export class OwnerReviewsHttpRepository implements OwnerReviewsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly reviewsUrl = `${inject(API_BASE_URL)}/owner/reviews`;

  getReviews(query: OwnerReviewQuery): Observable<PagedResult<OwnerReview>> {
    return this.httpClient.get<PagedResult<OwnerReview>>(this.reviewsUrl, {
      params: toOwnerReviewQueryParams(query),
    });
  }

  getSummary(): Observable<OwnerReviewSummary> {
    return this.httpClient.get<OwnerReviewSummary>(`${this.reviewsUrl}/summary`);
  }

  reportReview(id: string, report: ReviewReport): Observable<OwnerReview> {
    return this.httpClient.post<OwnerReview>(`${this.reviewsUrl}/${id}/report`, report);
  }
}
