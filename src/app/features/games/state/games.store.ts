import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { GameRepository } from '../data/game.repository';
import { GameEntry } from '../models/game-entry';
import { buildDeleteGameCopy } from './game-confirm-copy';
import { withGameTable } from './with-game-table';

/** Provided by the page, so each visit starts with empty filters. */
export const GamesStore = signalStore(
  withGameTable(),
  withState<{ readonly pendingDelete: GameEntry | null }>({ pendingDelete: null }),
  withComputed(({ pendingDelete }) => ({
    deleteCopy: computed(() => {
      const game = pendingDelete();
      return game ? buildDeleteGameCopy(game) : null;
    }),
  })),
  withMethods((store) => ({
    reloadAll(): void {
      store.loadGames();
      store.loadSummary();
    },
    askToDelete(game: GameEntry): void {
      store.clearSaveError();
      patchState(store, { pendingDelete: game });
    },
    cancelDelete(): void {
      patchState(store, { pendingDelete: null });
      store.clearSaveError();
    },
  })),
  withMethods((store, repository = inject(GameRepository)) => ({
    /** Deletes the game the question names; a refusal keeps the question open. */
    async confirmDelete(): Promise<void> {
      const game = store.pendingDelete();
      if (!game) {
        return;
      }
      const isDeleted = await store.saveThenRefresh(
        repository.deleteGame(game.id),
        () => store.reloadAll(),
        () => store.forgetRemovedEntry(game.id),
      );
      if (isDeleted) {
        patchState(store, { pendingDelete: null });
      }
    },
  })),
);
