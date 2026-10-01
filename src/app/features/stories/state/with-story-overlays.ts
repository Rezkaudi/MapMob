import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CLOCK } from '../../../core/config/clock';
import { StoryDetailView } from '../../../shared/models/story-detail-view';
import { StoryEntry } from '../models/story-entry';
import { StoryOverlay } from '../models/story-overlay';
import { StoryOverlayKind } from '../models/story-overlay-kind';
import { buildStoryConfirmCopy } from './story-confirm-copy';
import { toStoryDetail } from './story-detail';
import { visibilityActionFor } from './story-visibility';

/** The drawer and the hide, show and delete questions: one is open at a time. */
export function withStoryOverlays() {
  return signalStoreFeature(
    { methods: type<{ clearSaveError(): void }>() },
    withState<{ readonly overlay: StoryOverlay | null }>({ overlay: null }),
    withComputed(({ overlay }) => ({
      detail: computed<StoryDetailView | null>(() => {
        const open = overlay();
        return open?.kind === 'view' ? toStoryDetail(open.story, open.openedAt) : null;
      }),
      drawerAction: computed(() => {
        const open = overlay();
        return open?.kind === 'view' ? visibilityActionFor(open.story.status) : null;
      }),
      confirmCopy: computed(() => {
        const open = overlay();
        return open && open.kind !== 'view'
          ? buildStoryConfirmCopy(open.kind, open.story, open.openedAt)
          : null;
      }),
    })),
    withMethods((store, clock = inject(CLOCK)) => ({
      openOverlay(kind: StoryOverlayKind, story: StoryEntry): void {
        store.clearSaveError();
        patchState(store, { overlay: { kind, story, openedAt: clock() } });
      },
      closeOverlay(): void {
        patchState(store, { overlay: null });
        store.clearSaveError();
      },
    })),
  );
}
