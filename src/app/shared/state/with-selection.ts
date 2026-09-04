import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface SelectionState {
  readonly selectedIdSet: ReadonlySet<string>;
}

const initialSelectionState: SelectionState = {
  selectedIdSet: new Set(),
};

export function withSelection() {
  return signalStoreFeature(
    withState(initialSelectionState),
    withComputed(({ selectedIdSet }) => ({
      selectedIds: computed(() => Array.from(selectedIdSet())),
    })),
    withMethods((store) => ({
      isSelected(id: string): boolean {
        return store.selectedIdSet().has(id);
      },
      toggleSelected(id: string): void {
        const next = new Set(store.selectedIdSet());
        next.has(id) ? next.delete(id) : next.add(id);
        patchState(store, { selectedIdSet: next });
      },
      selectAll(ids: readonly string[]): void {
        patchState(store, { selectedIdSet: new Set(ids) });
      },
      clearSelection(): void {
        patchState(store, { selectedIdSet: new Set() });
      },
    })),
  );
}
