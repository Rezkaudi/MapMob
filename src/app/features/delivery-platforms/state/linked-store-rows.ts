import { LinkedStore } from '../models/linked-store';

export interface LinkedStoreRow {
  readonly store: LinkedStore;
  /** "طرطوس - الدريكيش", or the governorate alone. */
  readonly regionLabel: string;
}

export function buildLinkedStoreRows(stores: readonly LinkedStore[]): readonly LinkedStoreRow[] {
  return stores.map((store) => ({
    store,
    regionLabel: store.area
      ? `${store.governorate.name} - ${store.area.name}`
      : store.governorate.name,
  }));
}
