import { Signal, computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, tap } from 'rxjs';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { MerchantStoriesRepository } from '../data/merchant-stories.repository';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDetailView } from '../models/story-detail-view';
import { StoryDialogRequest } from '../models/story-dialog-request';
import { StoryDraft } from '../models/story-draft';
import { StoryFormOptions } from '../models/story-form-options';
import { buildRemoveStoryCopy } from './story-delete-copy';
import { toStoryDetail } from './story-detail-view';
import { describeStoryDialogNotice } from './story-quota';

/** What the dialogs need from the library feature they sit on. */
type LibraryState = { library: MerchantStoryLibrary | null; readAt: Date | null };
type LibraryProps = { placeName: Signal<string>; isFull: Signal<boolean> };
type LibraryEditing = {
  addToLibrary(story: MerchantStory): void;
  replaceInLibrary(story: MerchantStory): void;
  removeFromLibrary(id: string): void;
};

/** The add and edit form, the drawer and the delete question, each saved into the library. */
export function withStoryDialogs() {
  return signalStoreFeature(
    {
      state: type<LibraryState>(),
      props: type<LibraryProps>(),
      methods: type<LibraryEditing>(),
    },
    withState<{ readonly dialog: StoryDialogRequest | null }>({ dialog: null }),
    withSaveStatus(),
    withComputed(({ dialog, library, readAt, placeName }) => ({
      formDialog: computed<StoryFormOptions | null>(() => {
        const request = dialog();
        const loaded = library();
        if (!loaded) {
          return null;
        }
        if (request?.kind === 'add') {
          return { story: null, notice: describeStoryDialogNotice(loaded) };
        }
        return request?.kind === 'edit' ? { story: request.story, notice: null } : null;
      }),
      detail: computed<StoryDetailView | null>(() => {
        const request = dialog();
        const now = readAt();
        return request?.kind === 'view' && now
          ? toStoryDetail(request.story, placeName(), now)
          : null;
      }),
      deleteCopy: computed(() => {
        const request = dialog();
        const now = readAt();
        return request?.kind === 'delete' && now
          ? buildRemoveStoryCopy(request.story, placeName(), now)
          : null;
      }),
    })),
    withMethods((store, repository = inject(MerchantStoriesRepository)) => {
      const open = (dialog: StoryDialogRequest) => {
        store.clearSaveError();
        patchState(store, { dialog });
      };
      const saveAndClose = async (request: Observable<unknown>) => {
        if (await store.runSave(request)) {
          patchState(store, { dialog: null });
        }
      };
      return {
        openAdd(): void {
          if (store.library() && !store.isFull()) {
            open({ kind: 'add' });
          }
        },
        /** A story that has run out can only be looked at or deleted. */
        openEdit(story: MerchantStory): void {
          if (story.status === 'active') {
            open({ kind: 'edit', story });
          }
        },
        openView(story: MerchantStory): void {
          open({ kind: 'view', story });
        },
        openDelete(story: MerchantStory): void {
          open({ kind: 'delete', story });
        },
        closeDialog(): void {
          patchState(store, { dialog: null });
          store.clearSaveError();
        },
        async submitDraft(draft: StoryDraft): Promise<void> {
          const request = store.dialog();
          if (request?.kind === 'add') {
            const add = repository.addStory(draft);
            await saveAndClose(add.pipe(tap((saved) => store.addToLibrary(saved))));
          } else if (request?.kind === 'edit') {
            const update = repository.updateStory(request.story.id, draft);
            await saveAndClose(update.pipe(tap((saved) => store.replaceInLibrary(saved))));
          }
        },
        async confirmDelete(): Promise<void> {
          const request = store.dialog();
          if (request?.kind !== 'delete') {
            return;
          }
          const { id } = request.story;
          const remove = repository.deleteStory(id);
          await saveAndClose(remove.pipe(tap(() => store.removeFromLibrary(id))));
        },
      };
    }),
  );
}
