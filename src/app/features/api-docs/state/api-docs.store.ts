import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { API_REFERENCE } from '../data/api-reference';
import { HttpMethod } from '../models/http-method';
import { countEndpoints } from './count-endpoints';
import { groupFeaturesByApp } from './feature-groups';
import { filterApiFeatures } from './filter-api-features';
import { wholeDatabase } from './whole-database';

interface ApiDocsState {
  readonly search: string;
  readonly methodFilter: HttpMethod | null;
  readonly openEndpointIds: readonly string[];
  /** The print dialog shows the whole reference, every endpoint open. */
  readonly isPrinting: boolean;
  /** The sidebar link to mark as the one being read. */
  readonly activeSectionId: string | null;
}

const initialState: ApiDocsState = {
  search: '',
  methodFilter: null,
  openEndpointIds: [],
  isPrinting: false,
  activeSectionId: null,
};

export const ApiDocsStore = signalStore(
  withState(initialState),
  withComputed(
    ({ search, methodFilter, openEndpointIds, isPrinting }, reference = inject(API_REFERENCE)) => {
      const visibleFeatures = computed(() =>
        isPrinting()
          ? reference.features
          : filterApiFeatures(reference.features, search(), methodFilter()),
      );
      const visibleCount = computed(() => countEndpoints(visibleFeatures()).total);
      return {
        reference: computed(() => reference),
        counts: computed(() => countEndpoints(reference.features)),
        wholeDatabase: computed(() => wholeDatabase(reference.domains, reference.wholeErdLayout)),
        tableCount: computed(() =>
          reference.domains.reduce((sum, domain) => sum + domain.tables.length, 0),
        ),
        visibleFeatures,
        visibleFeatureGroups: computed(() => groupFeaturesByApp(visibleFeatures())),
        visibleCount,
        hasNoMatches: computed(() => visibleCount() === 0),
        openEndpointSet: computed(() => new Set(openEndpointIds())),
      };
    },
  ),
  withMethods((store) => ({
    isOpen(endpointId: string): boolean {
      return store.isPrinting() || store.openEndpointSet().has(endpointId);
    },

    setSearch(search: string): void {
      patchState(store, { search });
    },

    setMethodFilter(methodFilter: HttpMethod | null): void {
      patchState(store, { methodFilter });
    },

    toggleEndpoint(endpointId: string): void {
      const openIds = store.openEndpointIds();
      patchState(store, {
        openEndpointIds: openIds.includes(endpointId)
          ? openIds.filter((id) => id !== endpointId)
          : [...openIds, endpointId],
      });
    },

    openEndpoint(endpointId: string): void {
      if (!store.openEndpointSet().has(endpointId)) {
        patchState(store, { openEndpointIds: [...store.openEndpointIds(), endpointId] });
      }
    },

    openAllVisible(): void {
      const ids = store
        .visibleFeatures()
        .flatMap((feature) => feature.endpoints.map((endpoint) => endpoint.id));
      patchState(store, { openEndpointIds: ids });
    },

    closeAll(): void {
      patchState(store, { openEndpointIds: [] });
    },

    setActiveSection(activeSectionId: string | null): void {
      if (activeSectionId !== store.activeSectionId()) {
        patchState(store, { activeSectionId });
      }
    },

    startPrinting(): void {
      patchState(store, { isPrinting: true });
    },

    stopPrinting(): void {
      patchState(store, { isPrinting: false });
    },
  })),
);
