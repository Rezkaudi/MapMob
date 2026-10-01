import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CLOCK } from '../../../core/config/clock';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { toStoryCard } from './story-card-view';
import { countStories } from './story-count-tiles';
import { describeStoryLimit, describeStoryQuota } from './story-quota';
import { splitStories } from './story-sections';

interface StoryLibraryState {
  readonly library: MerchantStoryLibrary | null;
  /** When the stories were last read or changed; "متبقي 14 ساعة" counts from here. */
  readonly readAt: Date | null;
}

const initialState: StoryLibraryState = { library: null, readAt: null };

/** The loaded stories and what the page derives from them: both lists, the tiles and the quota. */
export function withStoryLibrary() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withComputed(({ library, readAt }) => {
      const items = computed(() => library()?.items ?? []);
      const sections = computed(() => splitStories(items()));
      const quota = computed(() => {
        const loaded = library();
        return loaded ? describeStoryQuota(loaded) : null;
      });
      const toCards = (stories: readonly MerchantStory[]) => {
        const now = readAt();
        return now ? stories.map((story) => toStoryCard(story, now)) : [];
      };
      return {
        activeCards: computed(() => toCards(sections().active)),
        expiredCards: computed(() => toCards(sections().expired)),
        countTiles: computed(() => countStories(items())),
        planName: computed(() => library()?.plan.name ?? ''),
        placeName: computed(() => library()?.place.name ?? ''),
        quota,
        limitText: computed(() => {
          const loaded = library();
          return loaded ? describeStoryLimit(loaded) : '';
        }),
        isFull: computed(() => quota()?.isFull ?? false),
        hasNoStories: computed(() => library() !== null && items().length === 0),
      };
    }),
    withMethods((store, clock = inject(CLOCK)) => {
      const replaceItems = (
        change: (items: readonly MerchantStory[]) => readonly MerchantStory[],
      ) => {
        const library = store.library();
        if (library) {
          patchState(store, {
            library: { ...library, items: change(library.items) },
            readAt: clock(),
          });
        }
      };
      return {
        showLibrary(library: MerchantStoryLibrary): void {
          patchState(store, { library, readAt: clock() });
        },
        addToLibrary(added: MerchantStory): void {
          replaceItems((items) => [added, ...items]);
        },
        replaceInLibrary(saved: MerchantStory): void {
          replaceItems((items) => items.map((story) => (story.id === saved.id ? saved : story)));
        },
        removeFromLibrary(id: string): void {
          replaceItems((items) => items.filter((story) => story.id !== id));
        },
      };
    }),
  );
}
