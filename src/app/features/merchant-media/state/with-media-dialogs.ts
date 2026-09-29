import { Signal, computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tap } from 'rxjs';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { findFileError } from '../../../shared/ui/media-picker/file-rules';
import { MerchantMediaRepository } from '../data/merchant-media.repository';
import { MediaAddOptions } from '../models/media-add-options';
import { MediaDialogRequest } from '../models/media-dialog-request';
import { MediaDraft } from '../models/media-draft';
import { MediaKind } from '../models/media-kind';
import { MediaRoom } from '../models/media-room';
import { MediaTab } from '../models/media-tab';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import { buildRemoveMediaCopy } from './media-delete-copy';
import { describeMediaDialogNotice } from './media-quota';
import { MEDIA_UPLOAD_RULES } from './media-upload-rules';

/** What the dialogs need from the library feature they sit on. */
type LibraryState = { library: MerchantMediaLibrary | null; selectedTab: MediaTab };
type LibraryRoom = { room: Signal<MediaRoom | null> };
type LibraryEditing = {
  addToLibrary(item: MerchantMediaItem): void;
  replaceInLibrary(item: MerchantMediaItem): void;
  removeFromLibrary(id: string): void;
};

/** The videos tab opens on video, unless the plan has no room left for one. */
function pickStartKind(tab: MediaTab, room: MediaRoom): MediaKind {
  const wanted: MediaKind = tab === 'videos' ? 'video' : 'image';
  const hasRoom = wanted === 'video' ? room.canAddVideo : room.canAddImage;
  if (hasRoom) {
    return wanted;
  }
  return wanted === 'video' ? 'image' : 'video';
}

/** The add form, the delete question and the in-place file swap, each saved into the library. */
export function withMediaDialogs() {
  return signalStoreFeature(
    {
      state: type<LibraryState>(),
      props: type<LibraryRoom>(),
      methods: type<LibraryEditing>(),
    },
    withState<{ readonly dialog: MediaDialogRequest | null }>({ dialog: null }),
    withSaveStatus(),
    withComputed(({ dialog, library, room }) => ({
      addDialog: computed<MediaAddOptions | null>(() => {
        const request = dialog();
        const loaded = library();
        const currentRoom = room();
        if (request?.kind !== 'add' || !loaded || !currentRoom) {
          return null;
        }
        return {
          startKind: request.startKind,
          canAddImage: currentRoom.canAddImage,
          canAddVideo: currentRoom.canAddVideo,
          notice: describeMediaDialogNotice(loaded),
        };
      }),
      deleteCopy: computed(() => {
        const request = dialog();
        return request?.kind === 'delete' ? buildRemoveMediaCopy(request.item) : null;
      }),
    })),
    withMethods((store, repository = inject(MerchantMediaRepository)) => {
      const closeWhenSaved = (isSaved: boolean) => {
        if (isSaved) {
          patchState(store, { dialog: null });
        }
      };
      return {
        openAdd(): void {
          const room = store.room();
          if (!room || room.isFull) {
            return;
          }
          patchState(store, {
            dialog: { kind: 'add', startKind: pickStartKind(store.selectedTab(), room) },
          });
        },
        openDelete(item: MerchantMediaItem): void {
          patchState(store, { dialog: { kind: 'delete', item } });
        },
        closeDialog(): void {
          patchState(store, { dialog: null });
          store.clearSaveError();
        },
        async submitDraft(draft: MediaDraft): Promise<void> {
          if (store.dialog()?.kind !== 'add') {
            return;
          }
          const add = repository.addMedia(draft).pipe(tap((saved) => store.addToLibrary(saved)));
          closeWhenSaved(await store.runSave(add));
        },
        async confirmDelete(): Promise<void> {
          const request = store.dialog();
          if (request?.kind !== 'delete') {
            return;
          }
          const { id } = request.item;
          const remove = repository.deleteMedia(id).pipe(tap(() => store.removeFromLibrary(id)));
          closeWhenSaved(await store.runSave(remove));
        },
        async replaceFile(item: MerchantMediaItem, file: File): Promise<void> {
          const fileError = findFileError(file, MEDIA_UPLOAD_RULES[item.kind]);
          if (fileError) {
            patchState(store, { saveError: fileError });
            return;
          }
          await store.runSave(
            repository
              .replaceMedia(item.id, file)
              .pipe(tap((saved) => store.replaceInLibrary(saved))),
          );
        },
      };
    }),
  );
}
