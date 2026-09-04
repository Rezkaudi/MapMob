import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

const DEFAULT_PAGE_SIZE = 20;

export interface PaginationState {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly totalCount: number;
}

const initialPaginationState: PaginationState = {
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
};

function lastPageIndex(totalCount: number, pageSize: number): number {
  return Math.max(0, Math.ceil(totalCount / pageSize) - 1);
}

export function withPagination() {
  return signalStoreFeature(
    withState(initialPaginationState),
    withComputed(({ totalCount, pageSize }) => ({
      pageCount: computed(() => Math.ceil(totalCount() / pageSize())),
    })),
    withMethods((store) => ({
      setTotalCount(totalCount: number): void {
        patchState(store, { totalCount });
      },
      setPageSize(pageSize: number): void {
        patchState(store, { pageSize, pageIndex: 0 });
      },
      goToPage(pageIndex: number): void {
        const clamped = Math.min(
          Math.max(pageIndex, 0),
          lastPageIndex(store.totalCount(), store.pageSize()),
        );
        patchState(store, { pageIndex: clamped });
      },
    })),
  );
}
