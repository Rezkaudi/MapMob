import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewQuery } from '../models/review-query';
import { ReviewSummary } from '../models/review-summary';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewHttpRepository implements ReviewRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getReviews(query: ReviewQuery): Observable<PagedResult<Review>> {
    let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    return this.httpClient.get<PagedResult<Review>>(`${this.apiBaseUrl}/reviews`, { params });
  }

  getSummary(): Observable<ReviewSummary> {
    return this.httpClient.get<ReviewSummary>(`${this.apiBaseUrl}/reviews/summary`);
  }
}
