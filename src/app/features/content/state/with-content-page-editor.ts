import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';

export interface ContentPageEditorState<TPage> {
  readonly page: TPage | null;
  /** Shows the confirmation toast after a save. */
  readonly isSavedMessageShown: boolean;
}

/** Wrapped in an object: rxMethod would read a bare function as a signal. */
export interface ContentPageLoad<TPage> {
  readonly fetch: () => Observable<TPage>;
}

/** Load one content page, then save it. Every save publishes it. */
export function withContentPageEditor<TPage>() {
  return signalStoreFeature(
    withState<ContentPageEditorState<TPage>>({ page: null, isSavedMessageShown: false }),
    withRequestStatus(),
    withSaveStatus(),
    withMethods((store) => ({
      loadPageWith: rxMethod<ContentPageLoad<TPage>>(
        pipe(
          tap(() => {
            patchState(store, { page: null, isSavedMessageShown: false } as ContentPageEditorState<TPage>);
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
      async savePageWith(request: Observable<TPage>): Promise<boolean> {
        patchState(store, { isSavedMessageShown: false });
        const isSaved = await store.runSave(
          request.pipe(
            tap((page) => patchState(store, { page } as Partial<ContentPageEditorState<TPage>>)),
          ),
        );
        if (isSaved) {
          patchState(store, { isSavedMessageShown: true });
        }
        return isSaved;
      },
      dismissSavedMessage(): void {
        patchState(store, { isSavedMessageShown: false });
      },
    })),
  );
}
