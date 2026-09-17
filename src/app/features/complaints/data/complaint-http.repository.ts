import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintSummary } from '../models/complaint-summary';
import { toComplaintQueryParams } from './complaint-query-params';
import { ComplaintRepository } from './complaint.repository';

@Injectable()
export class ComplaintHttpRepository implements ComplaintRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get complaintsUrl(): string {
    return `${this.apiBaseUrl}/complaints`;
  }

  getComplaints(query: ComplaintQuery): Observable<PagedResult<Complaint>> {
    return this.httpClient.get<PagedResult<Complaint>>(this.complaintsUrl, {
      params: toComplaintQueryParams(query),
    });
  }

  getSummary(): Observable<ComplaintSummary> {
    return this.httpClient.get<ComplaintSummary>(`${this.complaintsUrl}/summary`);
  }

  getComplaint(id: string): Observable<ComplaintDetail> {
    return this.httpClient.get<ComplaintDetail>(`${this.complaintsUrl}/${id}`);
  }

  saveReview(id: string, review: ComplaintReview): Observable<ComplaintDetail> {
    return this.httpClient.patch<ComplaintDetail>(`${this.complaintsUrl}/${id}`, review);
  }

  deleteComplaint(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.complaintsUrl}/${id}`);
  }

  exportComplaints(query: ComplaintQuery): Observable<Blob> {
    return this.httpClient.get(`${this.complaintsUrl}/export`, {
      params: toComplaintQueryParams(query),
      responseType: 'blob',
    });
  }
}
