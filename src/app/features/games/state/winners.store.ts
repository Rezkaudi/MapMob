import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { GameRepository } from '../data/game.repository';
import { GameWinner } from '../models/game-winner';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { buildDeliveryChangeCopy } from './game-confirm-copy';
import { toWinnerRow } from './winner-row';

/** The winners frame draws four rows under the header. */
const WINNER_PAGE_SIZE = 4;
const NO_WINNERS_MESSAGE = 'لا يوجد فائزون حتى الآن';
const NO_SEARCH_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

interface WinnersState {
  readonly pendingDeliveryChange: GameWinner | null;
  readonly isExporting: boolean;
}

function flipped(status: PrizeDeliveryStatus): PrizeDeliveryStatus {
  return status === 'delivered' ? 'pending' : 'delivered';
}

/** The winners tab: every winner of every game. Provided by the page. */
export const WinnersStore = signalStore(
  withListTable<GameWinner>({ pageSize: WINNER_PAGE_SIZE }),
  withState<WinnersState>({ pendingDeliveryChange: null, isExporting: false }),
  withComputed(({ entries, search, pendingDeliveryChange }) => ({
    rows: computed(() => entries().map(toWinnerRow)),
    emptyMessage: computed(() =>
      search().trim() ? NO_SEARCH_MATCHES_MESSAGE : NO_WINNERS_MESSAGE,
    ),
    deliveryCopy: computed(() => {
      const winner = pendingDeliveryChange();
      return winner ? buildDeliveryChangeCopy(winner) : null;
    }),
  })),
  withMethods((store, repository = inject(GameRepository)) => {
    const loadWinners = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getWinners(store.currentQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
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
    return { loadWinners };
  }),
  withMethods((store, repository = inject(GameRepository)) => ({
    setSearch(search: string): void {
      store.applyQuery({ search });
      store.loadWinners();
    },
    setSort(sort: ListSort | null): void {
      store.applyQuery({ sort });
      store.loadWinners();
    },
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.loadWinners();
    },
    askToChangeDelivery(winner: GameWinner): void {
      store.clearSaveError();
      patchState(store, { pendingDeliveryChange: winner });
    },
    cancelDeliveryChange(): void {
      patchState(store, { pendingDeliveryChange: null });
      store.clearSaveError();
    },
    /** `onChanged` lets the page refresh the cards that count delivered prizes. */
    async confirmDeliveryChange(onChanged: () => void = () => undefined): Promise<void> {
      const winner = store.pendingDeliveryChange();
      if (!winner) {
        return;
      }
      const request = repository.setPrizeDelivery(winner.id, flipped(winner.deliveryStatus));
      const isSaved = await store.saveThenRefresh(request, () => store.loadWinners(), onChanged);
      if (isSaved) {
        patchState(store, { pendingDeliveryChange: null });
      }
    },
    /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
    async exportWinners(): Promise<Blob | null> {
      patchState(store, { isExporting: true, saveError: null });
      try {
        return await lastValueFrom(repository.exportWinners(store.currentQuery()));
      } catch (error) {
        patchState(store, { saveError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isExporting: false });
      }
    },
  })),
);
