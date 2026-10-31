import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { LiveOwnerReview } from '../../../shared/data/live-owner-review';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { ReviewReport } from '../models/review-report';
import { LiveOwnerReviewSummary } from './live-owner-review-summary';
import { queryOwnerReviews } from './owner-review-list-query';
import { OwnerReviewsRepository } from './owner-reviews.repository';
import { toOwnerReview } from './to-owner-review';
import { toOwnerReviewSummary } from './to-owner-review-summary';

@Injectable()
export class OwnerReviewsHttpRepository implements OwnerReviewsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly reviewsUrl = `${inject(API_BASE_URL)}/owner/reviews`;

  // The server filters nothing yet, so the page filters, sorts and pages here.
  getReviews(query: OwnerReviewQuery): Observable<PagedResult<OwnerReview>> {
    return readAllOwnerPages<LiveOwnerReview>(this.httpClient, this.reviewsUrl).pipe(
      map((reviews) => queryOwnerReviews(reviews.map(toOwnerReview), query)),
    );
  }

  getSummary(): Observable<OwnerReviewSummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveOwnerReviewSummary>>(`${this.reviewsUrl}/summary`)
      .pipe(map(({ data }) => toOwnerReviewSummary(data)));
  }

  // The answer is the report, not the review; the page reloads the list after it anyway.
  reportReview(id: string, report: ReviewReport): Observable<OwnerReview> {
    return this.httpClient
      .post<LiveEnvelope<unknown>>(`${this.reviewsUrl}/${id}/report`, report)
      .pipe(
        map(() => ({
          ...toOwnerReview({ id, rating: null }),
          reportStatus: 'pending' as const,
        })),
      );
  }
}
