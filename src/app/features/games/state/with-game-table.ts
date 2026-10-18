import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { GameRepository } from '../data/game.repository';
import { GameEntry } from '../models/game-entry';
import { GameQuery } from '../models/game-query';
import { GameStatus } from '../models/game-status';
import { GameSummary } from '../models/game-summary';
import { toGameRow } from './game-row';
import { buildGameStatCards } from './game-stat-cards';
import { ALL_GAMES_CHIP, buildGameStatusChips } from './game-status-chips';
import { toUpcomingGameView } from './upcoming-game-view';

/** The frame draws three rows under the header. */
const GAME_PAGE_SIZE = 3;
const NO_GAMES_MESSAGE = 'لا توجد ألعاب حتى الآن';
const NO_STATUS_MATCHES_MESSAGE = 'لا توجد ألعاب بهذه الحالة';
const NO_SEARCH_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface GameTableState {
  readonly status: GameStatus | null;
  readonly summary: GameSummary | null;
  readonly isSummaryLoading: boolean;
}

const initialState: GameTableState = { status: null, summary: null, isSummaryLoading: false };

function describeEmptyTable(search: string, status: GameStatus | null): string {
  if (search.trim()) {
    return NO_SEARCH_MATCHES_MESSAGE;
  }
  return status ? NO_STATUS_MATCHES_MESSAGE : NO_GAMES_MESSAGE;
}

/** The paged game sessions, the status filter, and the numbers above them. */
export function withGameTable() {
  return signalStoreFeature(
    withState(initialState),
    withListTable<GameEntry>({ pageSize: GAME_PAGE_SIZE }),
    withComputed(({ entries, search, status, summary }, clock = inject(CLOCK)) => ({
      rows: computed(() => entries().map(toGameRow)),
      statCards: computed(() => buildGameStatCards(summary())),
      statusChips: computed(() => buildGameStatusChips(summary())),
      selectedChip: computed(() => status() ?? ALL_GAMES_CHIP),
      emptyMessage: computed(() => describeEmptyTable(search(), status())),
      upcomingGame: computed(() => {
        const game = summary()?.upcomingGame;
        return game ? toUpcomingGameView(game, clock()) : null;
      }),
    })),
    withMethods((store, repository = inject(GameRepository)) => {
      const gameQuery = (): GameQuery => {
        const status = store.status();
        return { ...store.currentQuery(), ...(status ? { status } : {}) };
      };

      const loadGames = rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getGames(gameQuery()).pipe(
              tap((page) => {
                if (store.showPage(page)) {
                  loadGames();
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

      const loadSummary = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isSummaryLoading: true })),
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, isSummaryLoading: false })),
              // The cards keep their last numbers; the table reports its own errors.
              catchError(() => {
                patchState(store, { isSummaryLoading: false });
                return of(null);
              }),
            ),
          ),
        ),
      );

      return { loadGames, loadSummary };
    }),
    withMethods((store) => ({
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadGames();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadGames();
      },
      setStatusFilter(status: GameStatus | null): void {
        patchState(store, { status });
        store.resetToFirstPage();
        store.loadGames();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.loadGames();
      },
    })),
  );
}
