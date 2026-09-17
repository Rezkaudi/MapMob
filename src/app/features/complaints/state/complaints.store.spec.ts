import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ComplaintRepository } from '../data/complaint.repository';
import { NO_COMPLAINT_FILTERS } from '../models/complaint-filters';
import { ComplaintQuery } from '../models/complaint-query';
import { buildComplaintDetail } from '../testing/complaint-fixture';
import { COMPLAINTS_PAGE_SIZE, ComplaintsStore } from './complaints.store';

const SHAM = buildComplaintDetail();
const SUMMARY = {
  totalCount: 248,
  newCount: 32,
  inReviewCount: 10,
  resolvedCount: 20,
  rejectedCount: 10,
};

function createStore(overrides: Partial<ComplaintRepository> = {}) {
  const requestedQueries: ComplaintQuery[] = [];
  const deletedIds: string[] = [];
  const repository: Partial<ComplaintRepository> = {
    getComplaints: (query) => {
      requestedQueries.push(query);
      return of({ items: [SHAM], totalCount: 1 });
    },
    getSummary: () => of(SUMMARY),
    deleteComplaint: (id) => {
      deletedIds.push(id);
      return of(undefined);
    },
    exportComplaints: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: ComplaintRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 17) },
    ],
  });
  return { store: TestBed.inject(ComplaintsStore), requestedQueries, deletedIds };
}

describe('ComplaintsStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(COMPLAINTS_PAGE_SIZE);
    expect(COMPLAINTS_PAGE_SIZE).toBe(4);
  });

  it('loads a page and the summary, then builds the rows and stat cards', () => {
    const { store } = createStore();

    store.loadComplaints();
    store.loadSummary();

    expect(store.rows().map((row) => row.complaint)).toEqual([SHAM]);
    expect(store.totalCount()).toBe(1);
    expect(store.statCards().map((card) => card.value)).toEqual(['248', '32', '10', '10', '20']);
    expect(store.isSummaryLoading()).toBe(false);
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getComplaints: () => throwError(() => new Error('تعذر تحميل البلاغات')),
    });

    store.loadComplaints();

    expect(store.error()).toBe('تعذر تحميل البلاغات');
  });

  it('turns the status and a preset period into the query, from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(2);

    store.applyFilters({ ...NO_COMPLAINT_FILTERS, status: 'new', reportPeriod: 'last7Days' });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      status: 'new',
      reportedFrom: '2026-09-11',
      reportedTo: '2026-09-17',
    });
    expect(store.activeFilterCount()).toBe(2);
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();
    store.changePage(1);

    store.setSearch('#1023');
    store.setSort('newest');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: '#1023',
      sort: 'newest',
    });
  });

  it('shows the empty page only when nothing was reported at all', () => {
    const { store } = createStore({ getComplaints: () => of({ items: [], totalCount: 0 }) });

    store.loadComplaints();
    expect(store.hasNoComplaints()).toBe(true);
    expect(store.emptyMessage()).toBe('لا توجد بلاغات حتى الآن');

    store.applyFilters({ ...NO_COMPLAINT_FILTERS, status: 'resolved' });
    expect(store.hasNoComplaints()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('deletes a complaint, then reloads the page and the summary', async () => {
    let summaryLoads = 0;
    const { store, deletedIds, requestedQueries } = createStore({
      getSummary: () => {
        summaryLoads++;
        return of(SUMMARY);
      },
    });

    expect(await store.deleteComplaint('complaint-1')).toBe(true);

    expect(deletedIds).toEqual(['complaint-1']);
    expect(requestedQueries).toHaveLength(1);
    expect(summaryLoads).toBe(1);
  });

  it('exports the filtered complaints, or keeps the error', async () => {
    const { store } = createStore();
    expect(await store.exportComplaints()).toBeInstanceOf(Blob);

    const failing = TestBed.inject(ComplaintRepository) as Partial<ComplaintRepository>;
    failing.exportComplaints = () => throwError(() => new Error('تعذر التصدير'));
    expect(await store.exportComplaints()).toBeNull();
    expect(store.saveError()).toBe('تعذر التصدير');
    expect(store.isExporting()).toBe(false);
  });
});
