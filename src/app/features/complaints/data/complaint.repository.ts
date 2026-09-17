import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintReview } from '../models/complaint-review';
import { ComplaintSummary } from '../models/complaint-summary';

export abstract class ComplaintRepository {
  abstract getComplaints(query: ComplaintQuery): Observable<PagedResult<Complaint>>;
  abstract getSummary(): Observable<ComplaintSummary>;
  abstract getComplaint(id: string): Observable<ComplaintDetail>;
  abstract saveReview(id: string, review: ComplaintReview): Observable<ComplaintDetail>;
  abstract deleteComplaint(id: string): Observable<void>;
  /** Every complaint matching the filters, not just one page. */
  abstract exportComplaints(query: ComplaintQuery): Observable<Blob>;
}
