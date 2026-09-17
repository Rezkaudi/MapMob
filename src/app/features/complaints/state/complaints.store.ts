import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { withListTable } from '../../../shared/state/with-list-table';
import { ComplaintRepository } from '../data/complaint.repository';
import { Complaint } from '../models/complaint';
import { ComplaintFilters, NO_COMPLAINT_FILTERS } from '../models/complaint-filters';
import { ComplaintQuery } from '../models/complaint-query';
import { ComplaintSummary } from '../models/complaint-summary';
import { buildComplaintRow } from './complaint-row';
import { buildComplaintStatCards } from './complaint-stat-cards';
import { countActiveComplaintFilters } from './count-active-complaint-filters';

/** The complaints design draws four rows per page. */
export const COMPLAINTS_PAGE_SIZE = 4;

export const NO_COMPLAINTS_MESSAGE = 'لا توجد بلاغات حتى الآن';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface ComplaintsState {
  readonly filters: ComplaintFilters;
  readonly summary: ComplaintSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: ComplaintsState = {
  filters: NO_COMPLAINT_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const ComplaintsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Complaint>({ pageSize: COMPLAINTS_PAGE_SIZE }),
  withComputed(({ entries, filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveComplaintFilters(filters()));
    return {
      activeFilterCount,
      rows: computed(() => entries().map(buildComplaintRow)),
      statCards: computed(() => buildComplaintStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing reported at all: the page swaps everything below its title for the message. */
      hasNoComplaints: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_COMPLAINTS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(ComplaintRepository), clock = inject(CLOCK)) => {
    const currentComplaintQuery = (): ComplaintQuery => {
      const { status, reportPeriod, customRange } = store.filters();
      const { from, to } = resolveDatePeriodRange(reportPeriod, customRange, clock());
      return {
        ...store.currentQuery(),
        ...(status ? { status } : {}),
        ...(from ? { reportedFrom: from } : {}),
        ...(to ? { reportedTo: to } : {}),
      };
    };

    return {
      currentComplaintQuery,
      loadComplaints: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getComplaints(currentComplaintQuery()).pipe(
              tap((page) => store.showPage(page)),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      loadSummary: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, hasSummaryFailed: false })),
              catchError(() => {
                patchState(store, { hasSummaryFailed: true });
                return of(null);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(ComplaintRepository)) => {
    const reloadAll = () => {
      store.loadComplaints();
      store.loadSummary();
    };

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadComplaints();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadComplaints();
      },
      applyFilters(filters: ComplaintFilters): void {
        patchState(store, { filters });
        store.resetToFirstPage();
        store.loadComplaints();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadComplaints();
      },
      deleteComplaint(id: string): Promise<boolean> {
        return store.saveThenRefresh(repository.deleteComplaint(id), reloadAll, () =>
          store.forgetRemovedEntry(id),
        );
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportComplaints(): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          return await lastValueFrom(repository.exportComplaints(store.currentComplaintQuery()));
        } catch (error) {
          patchState(store, { saveError: (error as Error).message });
          return null;
        } finally {
          patchState(store, { isExporting: false });
        }
      },
    };
  }),
);
