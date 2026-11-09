import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { guessTotalCount } from '../../../core/http/guess-total-count';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintSummary } from '../models/complaint-summary';
import { ComplaintRepository } from './complaint.repository';
import { toComplaintFilterParams } from './complaint-query-params';
import { LiveReport } from './live-report';
import { toComplaint, toComplaintDetail, toLiveReportStatus } from './live-report-mapping';
import { LiveReportedStore } from './live-reported-store';

interface LiveReportPage {
  readonly data: readonly LiveReport[];
  readonly meta?: { readonly total: number };
}

@Injectable()
export class ComplaintHttpRepository implements ComplaintRepository {
  readonly canDeleteComplaints = true;
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly reportsUrl = `${this.adminUrl}/reports`;

  getComplaints(query: ComplaintQuery): Observable<PagedResult<Complaint>> {
    const params = withPageNumber(toComplaintFilterParams(query), query);
    return this.httpClient.get<LiveReportPage>(this.reportsUrl, { params }).pipe(
      map((page) => ({
        items: page.data.map(toComplaint),
        totalCount: page.meta?.total ?? guessTotalCount(query, page.data.length),
      })),
    );
  }

  getSummary(): Observable<ComplaintSummary> {
    return this.httpClient
      .get<LiveEnvelope<ComplaintSummary>>(`${this.reportsUrl}/summary`)
      .pipe(map(({ data }) => data));
  }

  getComplaint(id: string): Observable<ComplaintDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveReport>>(`${this.reportsUrl}/${id}`)
      .pipe(switchMap(({ data }) => this.withStore(data)));
  }

  // PHP reads form fields on POST only, so the update names its real method in the body.
  saveReview(id: string, review: ComplaintReview): Observable<ComplaintDetail> {
    return this.httpClient
      .post<LiveEnvelope<LiveReport>>(`${this.reportsUrl}/${id}`, {
        _method: 'PUT',
        status: toLiveReportStatus(review.status),
        admin_notes: review.adminNotes,
      })
      .pipe(switchMap(({ data }) => this.withStore(data)));
  }

  deleteComplaint(id: string): Observable<void> {
    return this.httpClient.delete(`${this.reportsUrl}/${id}`).pipe(map(() => undefined));
  }

  exportComplaints(query: ComplaintQuery): Observable<Blob> {
    return this.httpClient.get(`${this.reportsUrl}/export`, {
      params: toComplaintFilterParams(query),
      responseType: 'blob',
    });
  }

  // A deleted store must not hide its report, so a failed store read leaves the card short.
  private withStore(report: LiveReport): Observable<ComplaintDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveReportedStore>>(`${this.adminUrl}/stores/${report.store.id}`)
      .pipe(
        map(({ data }) => toComplaintDetail(report, data)),
        catchError(() => of(toComplaintDetail(report, null))),
      );
  }
}
