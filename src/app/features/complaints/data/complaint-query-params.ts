import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { ComplaintQuery } from '../models/complaint-query';
import { toLiveReportStatus } from './live-report-mapping';

/** The table filters in the server's words; the list and the export send the same ones. */
export function toComplaintFilterParams(query: ComplaintQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    status: query.status ? toLiveReportStatus(query.status) : null,
    date_from: query.reportedFrom,
    date_to: query.reportedTo,
  });
}
