import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { Complaint } from '../models/complaint';
import { ComplaintQuery } from '../models/complaint-query';

export function filterComplaints<T extends Complaint>(
  complaints: readonly T[],
  query: ComplaintQuery,
): readonly T[] {
  const matching = complaints.filter((complaint) => matchesQuery(complaint, query));
  return sortListEntries(
    matching,
    query.sort,
    (complaint) => complaint.reportedOn,
    (complaint) => complaint.place.name,
  );
}

export function queryComplaints<T extends Complaint>(
  complaints: readonly T[],
  query: ComplaintQuery,
): PagedResult<T> {
  return paginate(filterComplaints(complaints, query), query.pageIndex, query.pageSize);
}

function matchesSearch(complaint: Complaint, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || [complaint.reference, complaint.place.name].some((text) => text.includes(term));
}

function matchesReportDay(complaint: Complaint, query: ComplaintQuery): boolean {
  if (query.reportedFrom && complaint.reportedOn < query.reportedFrom) {
    return false;
  }
  return !query.reportedTo || complaint.reportedOn <= query.reportedTo;
}

function matchesQuery(complaint: Complaint, query: ComplaintQuery): boolean {
  if (query.status && complaint.status !== query.status) {
    return false;
  }
  return matchesSearch(complaint, query.search) && matchesReportDay(complaint, query);
}
