import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { StoryStatus } from '../../../shared/models/story-status';
import { withListTable } from '../../../shared/state/with-list-table';
import { StoryRepository } from '../data/story.repository';
import { StoryEntry } from '../models/story-entry';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import { toStoryRow } from './story-row';
import { buildStoryStatCards } from './story-stat-cards';
import { ALL_STORIES_CHIP, buildStoryStatusChips } from './story-status-chips';

/** The frame draws four rows under the header. */
const STORY_PAGE_SIZE = 4;
const NO_STORIES_MESSAGE = 'لا توجد قصص منشورة حتى الآن';
const NO_STATUS_MATCHES_MESSAGE = 'لا توجد قصص بهذه الحالة';
const NO_SEARCH_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface StoryTableState {
  readonly status: StoryStatus | null;
  readonly summary: StorySummary | null;
  readonly isSummaryLoading: boolean;
}

const initialState: StoryTableState = { status: null, summary: null, isSummaryLoading: false };

function describeEmptyTable(search: string, status: StoryStatus | null): string {
  if (search.trim()) {
    return NO_SEARCH_MATCHES_MESSAGE;
  }
  return status ? NO_STATUS_MATCHES_MESSAGE : NO_STORIES_MESSAGE;
}

/** The paged rows, the status filter and the numbers of the cards and chips. */
export function withStoryTable() {
  return signalStoreFeature(
    withState(initialState),
    withListTable<StoryEntry>({ pageSize: STORY_PAGE_SIZE }),
    withComputed(({ entries, search, status, summary }) => ({
      rows: computed(() => entries().map(toStoryRow)),
      statCards: computed(() => buildStoryStatCards(summary())),
      statusChips: computed(() => buildStoryStatusChips(summary())),
      selectedChip: computed(() => status() ?? ALL_STORIES_CHIP),
      emptyMessage: computed(() => describeEmptyTable(search(), status())),
    })),
    withMethods((store, repository = inject(StoryRepository)) => {
      const storyQuery = (): StoryQuery => {
        const status = store.status();
        return { ...store.currentQuery(), ...(status ? { status } : {}) };
      };

      const loadStories = rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getStories(storyQuery()).pipe(
              tap((page) => {
                if (store.showPage(page)) {
                  loadStories();
                }
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      );

      const loadSummary = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isSummaryLoading: true })),
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, isSummaryLoading: false })),
              // The cards keep their last numbers; the table reports its own errors.
              catchError(() => {
                patchState(store, { isSummaryLoading: false });
                return of(null);
              }),
            ),
          ),
        ),
      );

      return { storyQuery, loadStories, loadSummary };
    }),
    withMethods((store) => ({
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadStories();
      },
      setStatusFilter(status: StoryStatus | null): void {
        patchState(store, { status });
        store.resetToFirstPage();
        store.loadStories();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadStories();
      },
    })),
  );
}
