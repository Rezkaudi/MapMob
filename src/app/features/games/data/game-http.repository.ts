import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveMetaPage, readAllMetaPages } from '../../../core/http/read-all-meta-pages';
import { paginate } from '../../../shared/lists/paginate';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { GameWinner } from '../models/game-winner';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';
import { matchGames, matchWinners } from './game-list-query';
import { toWinnerExportParams } from './game-query-params';
import { GameRepository } from './game.repository';
import { LiveGame } from './live-game';
import { toGameDetail, toGameEntry, toLiveGameBody } from './live-game-mapping';
import { LiveGameSummary } from './live-game-summary';
import { toGameSummary } from './live-game-summary-mapping';
import { LiveWinner } from './live-winner';
import { toGameWinner } from './live-winner-mapping';

const ALL_ROWS_PAGE_SIZE = 100;

// A winner row names its game only, so the games list fills in the round and prize.
function toGameWinners(
  winners: readonly LiveWinner[],
  games: readonly GameEntry[],
): readonly GameWinner[] {
  return winners.map((winner) => toGameWinner(winner, games));
}

function countDeliveredPrizes(winners: readonly GameWinner[], gameId: string): number {
  return winners.filter(
    (winner) => winner.game.id === gameId && winner.deliveryStatus === 'delivered',
  ).length;
}

/** The server ignores the sort, so every list is read whole and queried here. */
@Injectable()
export class GameHttpRepository implements GameRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly gamesUrl = `${inject(API_BASE_URL)}/admin/games`;
  private readonly winnersUrl = `${this.gamesUrl}/winners`;

  getGames(query: GameQuery): Observable<GamePage> {
    return this.loadGames().pipe(
      map((games) => paginate(matchGames(games, query), query.pageIndex, query.pageSize)),
    );
  }

  getSummary(): Observable<GameSummary> {
    return forkJoin({
      counts: this.httpClient.get<LiveEnvelope<LiveGameSummary>>(`${this.gamesUrl}/summary`),
      games: this.loadGames(),
      winners: this.readAll<LiveWinner>(this.winnersUrl),
    }).pipe(
      map(({ counts, games, winners }) =>
        toGameSummary(counts.data, games, toGameWinners(winners, games), this.clock()),
      ),
    );
  }

  getGameDetail(id: string): Observable<GameDetail> {
    return forkJoin({
      game: this.httpClient.get<LiveEnvelope<LiveGame>>(`${this.gamesUrl}/${id}`),
      winners: this.readAll<LiveWinner>(this.winnersUrl),
    }).pipe(
      map(({ game, winners }) =>
        toGameDetail(
          game.data,
          countDeliveredPrizes(
            winners.map((winner) => toGameWinner(winner, [])),
            id,
          ),
        ),
      ),
    );
  }

  createGame(draft: GameDraft): Observable<GameEntry> {
    return this.httpClient
      .post<LiveEnvelope<LiveGame>>(this.gamesUrl, toLiveGameBody(draft))
      .pipe(map(({ data }) => toGameEntry(data)));
  }

  updateGame(id: string, draft: GameDraft): Observable<GameEntry> {
    return this.httpClient
      .put<LiveEnvelope<LiveGame>>(`${this.gamesUrl}/${id}`, toLiveGameBody(draft))
      .pipe(map(({ data }) => toGameEntry(data)));
  }

  deleteGame(id: string): Observable<void> {
    return this.httpClient.delete(`${this.gamesUrl}/${id}`).pipe(map(() => undefined));
  }

  getWinners(query: WinnerQuery): Observable<WinnerPage> {
    return forkJoin({
      winners: this.readAll<LiveWinner>(this.winnersUrl),
      games: this.loadGames(),
    }).pipe(
      map(({ winners, games }) =>
        paginate(
          matchWinners(toGameWinners(winners, games), query),
          query.pageIndex,
          query.pageSize,
        ),
      ),
    );
  }

  setPrizeDelivery(winnerId: string, deliveryStatus: PrizeDeliveryStatus): Observable<void> {
    return this.httpClient
      .patch(`${this.winnersUrl}/${winnerId}/delivery`, { delivery_status: deliveryStatus })
      .pipe(map(() => undefined));
  }

  exportWinners(query: WinnerQuery): Observable<Blob> {
    return this.httpClient.get(`${this.winnersUrl}/export`, {
      params: toWinnerExportParams(query),
      responseType: 'blob',
    });
  }

  private loadGames(): Observable<readonly GameEntry[]> {
    return this.readAll<LiveGame>(this.gamesUrl).pipe(map((games) => games.map(toGameEntry)));
  }

  private readAll<T>(url: string): Observable<readonly T[]> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<T>>(url, {
        params: { page, per_page: ALL_ROWS_PAGE_SIZE },
      }),
    );
  }
}
