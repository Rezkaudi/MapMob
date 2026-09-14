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
import { PagedResult } from '../../../core/models/paged-result';
import { withPagination } from '../../../shared/state/with-pagination';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { withSelection } from '../../../shared/state/with-selection';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionEntry } from '../models/region-entry';
import { RegionSort } from '../models/region-sort';

/** The governorate and area tables both draw five rows per page. */
export const REGION_PAGE_SIZE = 5;

interface RegionTableState {
  readonly entries: readonly RegionEntry[];
  readonly search: string;
  readonly sort: RegionSort | null;
}

type RegionTableQueryPatch = Partial<Pick<RegionTableState, 'search' | 'sort'>>;

const initialRegionTableState: RegionTableState = {
  entries: [],
  search: '',
  sort: null,
};

export function withRegionTable() {
  return signalStoreFeature(
    withState(initialRegionTableState),
    withRequestStatus(),
    withPagination(),
    withSelection(),
    withSaveStatus(),
    withHooks({
      onInit(store) {
        store.setPageSize(REGION_PAGE_SIZE);
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
      currentQuery(): GovernorateQuery {
        const search = store.search().trim();
        const sort = store.sort();
        return {
          pageIndex: store.pageIndex(),
          pageSize: store.pageSize(),
          ...(search ? { search } : {}),
          ...(sort ? { sort } : {}),
        };
      },
      applyQuery(patch: RegionTableQueryPatch): void {
        patchState(store, patch);
        store.clearSelection();
        store.goToPage(0);
      },
      showPage(page: PagedResult<RegionEntry>): void {
        patchState(store, { entries: page.items });
        store.setTotalCount(page.totalCount);
        store.setLoaded();
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
  );
}
