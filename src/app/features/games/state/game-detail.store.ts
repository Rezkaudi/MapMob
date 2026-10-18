import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { GameRepository } from '../data/game.repository';
import { GameDetail } from '../models/game-detail';
import { GameDetailTab } from '../models/game-detail-tab';
import { GameWinner } from '../models/game-winner';
import { WinnerQuery } from '../models/winner-query';
import { toGameDetailView } from './game-detail-view';
import { gameDetailTabsFor } from './game-tabs';
import { toWinnerRow } from './winner-row';

/** A game has as many winners as its prize allows, so one page holds them all. */
const ALL_WINNERS_PAGE_SIZE = 100;

interface GameDetailState {
  readonly gameId: string | null;
  readonly detail: GameDetail | null;
  readonly tab: GameDetailTab;
  readonly expandedQuestionIds: readonly string[];
  readonly winners: readonly GameWinner[];
  readonly winnerSearch: string;
  readonly isWinnersLoading: boolean;
  readonly isExporting: boolean;
  readonly exportError: string | null;
}

const initialState: GameDetailState = {
  gameId: null,
  detail: null,
  tab: 'questions',
  expandedQuestionIds: [],
  winners: [],
  winnerSearch: '',
  isWinnersLoading: false,
  isExporting: false,
  exportError: null,
};

/** The detail modal: one game, its questions and, once finished, its winners. */
export const GameDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ gameId, detail, winners }) => ({
    isOpen: computed(() => gameId() !== null),
    view: computed(() => {
      const game = detail();
      return game ? toGameDetailView(game) : null;
    }),
    tabs: computed(() => gameDetailTabsFor(detail()?.status === 'finished')),
    winnerRows: computed(() => winners().map(toWinnerRow)),
  })),
  withMethods((store, repository = inject(GameRepository)) => {
    const winnerQuery = (): WinnerQuery => {
      const search = store.winnerSearch().trim();
      return {
        pageIndex: 0,
        pageSize: ALL_WINNERS_PAGE_SIZE,
        gameId: store.gameId() ?? '',
        ...(search ? { search } : {}),
      };
    };

    const loadWinners = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isWinnersLoading: true })),
        switchMap(() =>
          repository.getWinners(winnerQuery()).pipe(
            tap(({ items }) => patchState(store, { winners: items, isWinnersLoading: false })),
            catchError(() => {
              patchState(store, { winners: [], isWinnersLoading: false });
              return of(null);
            }),
          ),
        ),
      ),
    );

    const loadDetail = rxMethod<GameDetailTab | null>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((requestedTab) =>
          repository.getGameDetail(store.gameId() ?? '').pipe(
            tap((detail) => {
              const isFinished = detail.status === 'finished';
              const tab = isFinished ? (requestedTab ?? 'winners') : 'questions';
              const firstQuestion = detail.questions[0]?.id;
              patchState(store, {
                detail,
                tab,
                expandedQuestionIds: firstQuestion ? [firstQuestion] : [],
              });
              store.setLoaded();
              if (isFinished) {
                loadWinners();
              }
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    );

    return { winnerQuery, loadWinners, loadDetail };
  }),
  withMethods((store, repository = inject(GameRepository)) => ({
    open(gameId: string, tab: GameDetailTab | null = null): void {
      patchState(store, { ...initialState, gameId });
      store.loadDetail(tab);
    },
    retry(): void {
      store.loadDetail(store.tab());
    },
    close(): void {
      patchState(store, initialState);
      store.clearError();
    },
    selectTab(tab: GameDetailTab): void {
      patchState(store, { tab });
    },
    toggleQuestion(questionId: string): void {
      const expanded = store.expandedQuestionIds();
      patchState(store, {
        expandedQuestionIds: expanded.includes(questionId)
          ? expanded.filter((id) => id !== questionId)
          : [...expanded, questionId],
      });
    },
    setWinnerSearch(winnerSearch: string): void {
      patchState(store, { winnerSearch });
      store.loadWinners();
    },
    /** Resolves the file to save, or `null` when the export failed and `exportError` says why. */
    async exportWinners(): Promise<Blob | null> {
      patchState(store, { isExporting: true, exportError: null });
      try {
        return await lastValueFrom(repository.exportWinners(store.winnerQuery()));
      } catch (error) {
        patchState(store, { exportError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isExporting: false });
      }
    },
    clearExportError(): void {
      patchState(store, { exportError: null });
    },
  })),
);
