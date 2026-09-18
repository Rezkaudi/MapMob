import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable } from 'rxjs';
import { PagedResult } from '../../core/models/paged-result';
import { ListQuery } from '../models/list-query';
import { ListSort } from '../models/list-sort';
import { withPagination } from './with-pagination';
import { withRequestStatus } from './with-request-status';
import { withSaveStatus } from './with-save-status';
import { withSelection } from './with-selection';

/** The region and category tables draw five rows per page. */
export const LIST_PAGE_SIZE = 5;

interface ListTableState<TEntry> {
  readonly entries: readonly TEntry[];
  readonly search: string;
  readonly sort: ListSort | null;
}

type ListTableQueryPatch = Partial<{ readonly search: string; readonly sort: ListSort | null }>;

interface ListTableOptions {
  readonly pageSize: number;
}

export function withListTable<TEntry extends { readonly id: string }>(
  options: ListTableOptions = { pageSize: LIST_PAGE_SIZE },
) {
  return signalStoreFeature(
    withState<ListTableState<TEntry>>({ entries: [], search: '', sort: null }),
    withRequestStatus(),
    withPagination(),
    withSelection(),
    withSaveStatus(),
    withHooks({
      onInit(store) {
        store.setPageSize(options.pageSize);
      },
    }),
    withComputed(({ entries, isLoading, search, selectedIdSet }) => {
      const hasNoResults = computed(() => !isLoading() && entries().length === 0);
      return {
        hasNoResults,
        /** Nothing exists at all, as opposed to a search that matched nothing. */
        hasNoEntries: computed(() => hasNoResults() && !search().trim()),
        areAllVisibleSelected: computed(
          () => entries().length > 0 && entries().every((entry) => selectedIdSet().has(entry.id)),
        ),
      };
    }),
    withMethods((store) => ({
      currentQuery(): ListQuery {
        const search = store.search().trim();
        const sort = store.sort();
        return {
          pageIndex: store.pageIndex(),
          pageSize: store.pageSize(),
          ...(search ? { search } : {}),
          ...(sort ? { sort } : {}),
        };
      },
      /** Call after any filter changes: the old page and ticks no longer match the rows. */
      resetToFirstPage(): void {
        store.clearSelection();
        store.goToPage(0);
      },
      /**
       * Shows a loaded page. Resolves `true` when the page came back past the end of
       * the rows — a status change or another admin's delete can shrink the list under
       * us — in which case it steps back and the caller loads again.
       */
      showPage(page: PagedResult<TEntry>): boolean {
        const lastPage = Math.max(0, Math.ceil(page.totalCount / store.pageSize()) - 1);
        const isPageStale = page.items.length === 0 && store.pageIndex() > lastPage;
        if (isPageStale) {
          store.setTotalCount(page.totalCount);
          store.goToPage(lastPage);
          return true;
        }

        patchState(store, { entries: page.items });
        store.setTotalCount(page.totalCount);
        store.keepOnlySelected(page.items.map((entry) => entry.id));
        store.setLoaded();
        return false;
      },
      async saveThenRefresh(
        request: Observable<unknown>,
        refresh: () => void,
        onSaved: () => void = () => undefined,
      ): Promise<boolean> {
        const isSaved = await store.runSave(request);
        if (isSaved) {
          onSaved();
          refresh();
        }
        return isSaved;
      },
      toggleAllVisible(): void {
        if (store.areAllVisibleSelected()) {
          store.clearSelection();
          return;
        }
        store.selectAll(store.entries().map((entry) => entry.id));
      },
      /** Call once a delete succeeds: the only row on a later page would leave the reload empty. */
      forgetRemovedEntry(id: string): void {
        if (store.isSelected(id)) {
          store.toggleSelected(id);
        }
        const isLastRowOnPage = store.entries().length === 1 && store.pageIndex() > 0;
        if (isLastRowOnPage) {
          store.goToPage(store.pageIndex() - 1);
        }
      },
    })),
    withMethods((store) => ({
      applyQuery(patch: ListTableQueryPatch): void {
        patchState(store, patch);
        store.resetToFirstPage();
      },
    })),
  );
}
