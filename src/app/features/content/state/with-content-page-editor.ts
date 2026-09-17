import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { ContentPageStatus } from '../models/content-page-status';

export interface ContentPageEditorState<TPage> {
  readonly page: TPage | null;
  /** How the last save went out, for the confirmation toast; `null` hides it. */
  readonly savedStatus: ContentPageStatus | null;
}

/** Wrapped in an object: rxMethod would read a bare function as a signal. */
export interface ContentPageLoad<TPage> {
  readonly fetch: () => Observable<TPage>;
}

/** Load one content page, then save it as published or as a draft. */
export function withContentPageEditor<TPage>() {
  return signalStoreFeature(
    withState<ContentPageEditorState<TPage>>({ page: null, savedStatus: null }),
    withRequestStatus(),
    withSaveStatus(),
    withMethods((store) => ({
      loadPageWith: rxMethod<ContentPageLoad<TPage>>(
        pipe(
          tap(() => {
            patchState(store, { page: null, savedStatus: null } as ContentPageEditorState<TPage>);
            store.setLoading();
          }),
          switchMap((load) =>
            load.fetch().pipe(
              tap((page) => {
                patchState(store, { page } as Partial<ContentPageEditorState<TPage>>);
                store.setLoaded();
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      async savePageWith(request: Observable<TPage>, status: ContentPageStatus): Promise<boolean> {
        patchState(store, { savedStatus: null });
        const isSaved = await store.runSave(
          request.pipe(
            tap((page) => patchState(store, { page } as Partial<ContentPageEditorState<TPage>>)),
          ),
        );
        if (isSaved) {
          patchState(store, { savedStatus: status });
        }
        return isSaved;
      },
      dismissSavedMessage(): void {
        patchState(store, { savedStatus: null });
      },
    })),
  );
}
