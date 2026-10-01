import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Observable, lastValueFrom } from 'rxjs';
import { StoryRepository } from '../data/story.repository';
import { withStoryOverlays } from './with-story-overlays';
import { withStoryTable } from './with-story-table';

interface StoryWrite {
  readonly request: Observable<unknown>;
  readonly onSaved?: () => void;
}

/** Provided by the page, so each visit starts with empty filters. */
export const StoriesStore = signalStore(
  withStoryTable(),
  withStoryOverlays(),
  withState({ isExporting: false }),
  withMethods((store, repository = inject(StoryRepository)) => {
    const reloadAll = () => {
      store.loadStories();
      store.loadSummary();
    };

    /** What the open question saves; the drawer saves nothing. */
    const writeOfOverlay = (): StoryWrite | null => {
      const open = store.overlay();
      if (!open || open.kind === 'view') {
        return null;
      }
      const { id } = open.story;
      if (open.kind === 'delete') {
        return { request: repository.deleteStory(id), onSaved: () => store.forgetRemovedEntry(id) };
      }
      return { request: repository.setStoryHidden(id, open.kind === 'hide') };
    };

    return {
      /** Saves what the open question asks, then closes it; a refusal keeps it open. */
      async confirmOverlay(): Promise<void> {
        const write = writeOfOverlay();
        if (!write) {
          return;
        }
        const isSaved = await store.saveThenRefresh(write.request, reloadAll, write.onSaved);
        if (isSaved) {
          store.closeOverlay();
        }
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportStories(): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          const request = { query: store.storyQuery(), ids: store.selectedIds() };
          return await lastValueFrom(repository.exportStories(request));
        } catch (error) {
          patchState(store, { saveError: (error as Error).message });
          return null;
        } finally {
          patchState(store, { isExporting: false });
        }
      },
    };
  }),
);
