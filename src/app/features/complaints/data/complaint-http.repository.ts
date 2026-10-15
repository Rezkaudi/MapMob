import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintSummary } from '../models/complaint-summary';
import { filterComplaints, queryComplaints } from './complaint-list-query';
import { ComplaintRepository } from './complaint.repository';
import { buildComplaintsCsvFile } from './complaints-csv';
import { LiveReport } from './live-report';
import { toComplaint, toComplaintDetail, toLiveReportStatus } from './live-report-mapping';
import { LiveReportedStore } from './live-reported-store';

/** The list comes all at once with no filters, so it is searched and paged here. */
@Injectable()
export class ComplaintHttpRepository implements ComplaintRepository {
  readonly canDeleteComplaints = true;
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly reportsUrl = `${this.adminUrl}/reports`;

  getComplaints(query: ComplaintQuery): Observable<PagedResult<Complaint>> {
    return this.loadAll().pipe(map((complaints) => queryComplaints(complaints, query)));
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
    return this.loadAll().pipe(
      map((complaints) => buildComplaintsCsvFile(filterComplaints(complaints, query))),
    );
  }

  private loadAll(): Observable<readonly Complaint[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveReport[]>>(this.reportsUrl)
      .pipe(map(({ data }) => data.map(toComplaint)));
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
