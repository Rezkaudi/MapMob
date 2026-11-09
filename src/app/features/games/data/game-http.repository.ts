import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePage } from '../../../core/http/live-page';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';
import { toGameListParams, toWinnerListParams } from './game-query-params';
import { GameRepository } from './game.repository';
import { LiveGame } from './live-game';
import { toGameDetail, toGameEntry, toLiveGameBody } from './live-game-mapping';
import { LiveGameSummary } from './live-game-summary';
import { toGameSummary } from './live-game-summary-mapping';
import { LiveWinner } from './live-winner';
import { toGameWinner } from './live-winner-mapping';

const NO_DELIVERED_PRIZES = 0;
const NEXT_GAME_QUERY: GameQuery = { pageIndex: 0, pageSize: 1, status: 'scheduled', sort: 'oldest' };

function gameIdOf(winner: LiveWinner): string {
  return String(winner.game?.id ?? winner.game_id ?? '');
}

@Injectable()
export class GameHttpRepository implements GameRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly gamesUrl = `${inject(API_BASE_URL)}/admin/games`;
  private readonly winnersUrl = `${this.gamesUrl}/winners`;

  getGames(query: GameQuery): Observable<GamePage> {
    return this.httpClient
      .get<LivePage<LiveGame>>(this.gamesUrl, {
        params: withPageNumber(toGameListParams(query), query),
      })
      .pipe(map((page) => ({ items: page.data.map(toGameEntry), totalCount: page.meta.total })));
  }

  getSummary(): Observable<GameSummary> {
    return forkJoin({
      counts: this.httpClient.get<LiveEnvelope<LiveGameSummary>>(`${this.gamesUrl}/summary`),
      nextGames: this.getGames(NEXT_GAME_QUERY),
    }).pipe(
      map(({ counts, nextGames }) => toGameSummary(counts.data, nextGames.items[0] ?? null)),
    );
  }

  getGameDetail(id: string): Observable<GameDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveGame>>(`${this.gamesUrl}/${id}`)
      .pipe(
        map(({ data }) => toGameDetail(data, data.deliveredPrizeCount ?? NO_DELIVERED_PRIZES)),
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
    return this.httpClient
      .get<LivePage<LiveWinner>>(this.winnersUrl, {
        params: withPageNumber(toWinnerListParams(query), query),
      })
      .pipe(
        switchMap((page) =>
          this.readGamesOf(page.data).pipe(
            map((games) => ({
              items: page.data.map((winner) => toGameWinner(winner, games)),
              totalCount: page.meta.total,
            })),
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
      params: toWinnerListParams(query),
      responseType: 'blob',
    });
  }

  // A winner row names its game only, so the page's own games fill in the round and prize.
  private readGamesOf(winners: readonly LiveWinner[]): Observable<readonly GameEntry[]> {
    const gameIds = [...new Set(winners.map(gameIdOf).filter(Boolean))];
    if (gameIds.length === 0) {
      return of([]);
    }
    return forkJoin(
      gameIds.map((id) =>
        this.httpClient
          .get<LiveEnvelope<LiveGame>>(`${this.gamesUrl}/${id}`)
          .pipe(map(({ data }) => toGameEntry(data))),
      ),
    );
  }
}
