import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintSummary } from '../models/complaint-summary';
import { ComplaintMockDatabase } from './complaint-mock-database';
import { filterComplaints, queryComplaints } from './complaint-mock-query';
import { buildComplaintsCsvFile } from './complaints-csv';
import { ComplaintRepository } from './complaint.repository';

@Injectable()
export class ComplaintMockRepository implements ComplaintRepository {
  private readonly database = inject(ComplaintMockDatabase);

  getComplaints(query: ComplaintQuery): Observable<PagedResult<Complaint>> {
    return mockRequest(() => queryComplaints(this.database.list(), query));
  }

  getSummary(): Observable<ComplaintSummary> {
    return mockRequest(() => this.database.summarize());
  }

  getComplaint(id: string): Observable<ComplaintDetail> {
    return mockRequest(() => this.database.find(id));
  }

  saveReview(id: string, review: ComplaintReview): Observable<ComplaintDetail> {
    return mockRequest(() => this.database.saveReview(id, review));
  }

  deleteComplaint(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  exportComplaints(query: ComplaintQuery): Observable<Blob> {
    return mockRequest(() => buildComplaintsCsvFile(filterComplaints(this.database.list(), query)));
  }
}
