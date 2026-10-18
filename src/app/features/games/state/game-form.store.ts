import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { GameRepository } from '../data/game.repository';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';

interface GameFormState {
  readonly editingId: string | null;
  readonly editedDetail: GameDetail | null;
}

/** What the add and edit pages load and save. */
export const GameFormStore = signalStore(
  withState<GameFormState>({ editingId: null, editedDetail: null }),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ editingId, editedDetail, isLoading, error }) => ({
    isReady: computed(
      () => !isLoading() && !error() && (editingId() === null || editedDetail() !== null),
    ),
  })),
  withMethods((store, repository = inject(GameRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => patchState(store, { editingId, editedDetail: null })),
        switchMap((editingId) => {
          if (!editingId) {
            store.setLoaded();
            return of(null);
          }
          store.setLoading();
          return repository.getGameDetail(editingId).pipe(
            tap((editedDetail) => {
              patchState(store, { editedDetail });
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withMethods((store, repository = inject(GameRepository)) => ({
    retry(): void {
      store.load(store.editingId());
    },
    save(editingId: string | null, draft: GameDraft): Promise<boolean> {
      return store.runSave(
        editingId ? repository.updateGame(editingId, draft) : repository.createGame(draft),
      );
    },
  })),
);
