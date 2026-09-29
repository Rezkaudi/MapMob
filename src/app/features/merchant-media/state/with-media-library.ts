import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { MediaTab } from '../models/media-tab';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import { toMediaCard } from './media-card-view';
import { countMedia } from './media-count-tiles';
import { describeMediaLimit, describeMediaQuota } from './media-quota';
import { describeMediaRoom } from './media-room';
import { buildMediaTabs, filterMediaByTab } from './media-tabs';

interface MediaLibraryState {
  readonly library: MerchantMediaLibrary | null;
  readonly selectedTab: MediaTab;
}

const initialState: MediaLibraryState = { library: null, selectedTab: 'all' };

/** The loaded gallery and what the page derives from it: cards, tabs, tiles and the quota. */
export function withMediaLibrary() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withComputed(({ library, selectedTab }) => {
      const items = computed(() => library()?.items ?? []);
      const room = computed(() => {
        const loaded = library();
        return loaded ? describeMediaRoom(loaded) : null;
      });
      return {
        cards: computed(() => filterMediaByTab(items(), selectedTab()).map(toMediaCard)),
        tabs: computed(() => buildMediaTabs(items())),
        countTiles: computed(() => countMedia(items())),
        planName: computed(() => library()?.plan.name ?? ''),
        quota: computed(() => {
          const loaded = library();
          return loaded ? describeMediaQuota(loaded) : null;
        }),
        limitText: computed(() => {
          const loaded = library();
          return loaded ? describeMediaLimit(loaded) : '';
        }),
        room,
        isFull: computed(() => room()?.isFull ?? false),
        hasNoMedia: computed(() => library() !== null && items().length === 0),
      };
    }),
    withMethods((store) => {
      const replaceItems = (
        change: (items: readonly MerchantMediaItem[]) => readonly MerchantMediaItem[],
      ) => {
        const library = store.library();
        if (library) {
          patchState(store, { library: { ...library, items: change(library.items) } });
        }
      };
      return {
        selectTab(selectedTab: MediaTab): void {
          patchState(store, { selectedTab });
        },
        /** The server moves the main flag to a new main picture; the page mirrors that. */
        addToLibrary(added: MerchantMediaItem): void {
          replaceItems((items) => [
            ...items.map((item) => (added.isMain ? { ...item, isMain: false } : item)),
            added,
          ]);
        },
        replaceInLibrary(saved: MerchantMediaItem): void {
          replaceItems((items) => items.map((item) => (item.id === saved.id ? saved : item)));
        },
        removeFromLibrary(id: string): void {
          replaceItems((items) => items.filter((item) => item.id !== id));
        },
      };
    }),
  );
}
