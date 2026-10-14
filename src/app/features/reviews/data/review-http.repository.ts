import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, expand, forkJoin, map, of, reduce, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewDetail } from '../models/review-detail';
import { ReviewQuery } from '../models/review-query';
import { ModeratedReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';
import { LiveReview } from './live-review';
import { toLiveReviewStatus, toReview, toReviewDetail } from './live-review-mapping';
import { LiveReviewedStore, LiveReviewer } from './live-review-people';
import { filterReviews, queryReviews } from './review-list-query';
import { ReviewRepository } from './review.repository';
import { buildReviewsCsvFile } from './reviews-csv';

const FIRST_PAGE = 1;
// The server asks for a note when a report is settled; the panel has no field for one.
const ACCEPT_NOTE = 'قُبل البلاغ من لوحة التحكم';
const REJECT_NOTE = 'رُفض البلاغ من لوحة التحكم';

interface LiveReviewPage {
  readonly data: readonly LiveReview[];
  readonly current_page: number;
  readonly last_page: number;
}

interface LiveReviewSummary {
  readonly total_reviews: number;
  readonly average_rating: number | null;
  readonly new_reviews: number;
  readonly reported_reviews: number;
}

/** The list ignores every filter and the page size, so all pages are read and filtered here. */
@Injectable()
export class ReviewHttpRepository implements ReviewRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly reviewsUrl = `${this.adminUrl}/reviews`;

  getReviews(query: ReviewQuery): Observable<PagedResult<Review>> {
    return this.loadAll().pipe(map((reviews) => queryReviews(reviews.map(toReview), query)));
  }

  getSummary(): Observable<ReviewSummary> {
    return this.httpClient.get<LiveReviewSummary>(`${this.reviewsUrl}/summary`).pipe(
      map((summary) => ({
        totalCount: summary.total_reviews,
        averageRating: summary.average_rating ?? 0,
        newCount: summary.new_reviews,
        reportedCount: summary.reported_reviews,
      })),
    );
  }

  getReviewDetail(id: string): Observable<ReviewDetail> {
    return this.readReview(id).pipe(
      switchMap((review) =>
        forkJoin({
          reviewer: this.readOrNull<LiveReviewer>(`${this.adminUrl}/users/${review.user_id}`),
          store: this.readOrNull<LiveReviewedStore>(`${this.adminUrl}/stores/${review.store_id}`),
          all: this.loadAll(),
        }).pipe(
          map(({ reviewer, store, all }) =>
            toReviewDetail(
              review,
              reviewer,
              store,
              all.filter((other) => other.user_id === review.user_id).length,
            ),
          ),
        ),
      ),
    );
  }

  acceptReport(id: string): Observable<Review> {
    return this.settle(`${this.reviewsUrl}/${id}/report/accept`, ACCEPT_NOTE, id);
  }

  rejectReport(id: string): Observable<Review> {
    return this.settle(`${this.reviewsUrl}/${id}/report/reject`, REJECT_NOTE, id);
  }

  setReviewStatus(id: string, status: ModeratedReviewStatus): Observable<Review> {
    return this.httpClient
      .patch(`${this.reviewsUrl}/${id}/status`, { status: toLiveReviewStatus(status) })
      .pipe(switchMap(() => this.readReview(id).pipe(map(toReview))));
  }

  deleteReview(id: string): Observable<void> {
    return this.httpClient.delete(`${this.reviewsUrl}/${id}`).pipe(map(() => undefined));
  }

  // The server's own file lists ids, not names, and ignores the filters.
  exportReviews(query: ReviewQuery): Observable<Blob> {
    return this.loadAll().pipe(
      map((reviews) => buildReviewsCsvFile(filterReviews(reviews.map(toReview), query))),
    );
  }

  private settle(url: string, note: string, id: string): Observable<Review> {
    return this.httpClient
      .post(url, { admin_notes: note })
      .pipe(switchMap(() => this.readReview(id).pipe(map(toReview))));
  }

  private readReview(id: string): Observable<LiveReview> {
    return this.httpClient.get<LiveReview>(`${this.reviewsUrl}/${id}`);
  }

  private loadAll(): Observable<readonly LiveReview[]> {
    return this.readPage(FIRST_PAGE).pipe(
      expand((page) =>
        page.current_page < page.last_page ? this.readPage(page.current_page + 1) : EMPTY,
      ),
      reduce<LiveReviewPage, readonly LiveReview[]>((all, page) => [...all, ...page.data], []),
    );
  }

  private readPage(page: number): Observable<LiveReviewPage> {
    return this.httpClient.get<LiveReviewPage>(this.reviewsUrl, { params: { page } });
  }

  // A deleted user or store must not hide the review, so it only shortens the drawer.
  private readOrNull<T>(url: string): Observable<T | null> {
    return this.httpClient.get<LiveEnvelope<T>>(url).pipe(
      map(({ data }) => data),
      catchError(() => of(null)),
    );
  }
}
