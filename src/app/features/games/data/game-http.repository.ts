import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';
import { toGameParams, toWinnerParams } from './game-query-params';
import { GameRepository } from './game.repository';

/** Calls the contract on /docs#games; the live server has no games routes yet. */
@Injectable()
export class GameHttpRepository implements GameRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly gamesUrl = `${inject(API_BASE_URL)}/admin/games`;
  private readonly winnersUrl = `${this.gamesUrl}/winners`;

  getGames(query: GameQuery): Observable<GamePage> {
    return this.httpClient.get<GamePage>(this.gamesUrl, { params: toGameParams(query) });
  }

  getSummary(): Observable<GameSummary> {
    return this.httpClient.get<GameSummary>(`${this.gamesUrl}/summary`);
  }

  getGameDetail(id: string): Observable<GameDetail> {
    return this.httpClient.get<GameDetail>(`${this.gamesUrl}/${id}`);
  }

  createGame(draft: GameDraft): Observable<GameEntry> {
    return this.httpClient.post<GameEntry>(this.gamesUrl, draft);
  }

  updateGame(id: string, draft: GameDraft): Observable<GameEntry> {
    return this.httpClient.put<GameEntry>(`${this.gamesUrl}/${id}`, draft);
  }

  deleteGame(id: string): Observable<void> {
    return this.httpClient.delete(`${this.gamesUrl}/${id}`).pipe(map(() => undefined));
  }

  getWinners(query: WinnerQuery): Observable<WinnerPage> {
    return this.httpClient.get<WinnerPage>(this.winnersUrl, { params: toWinnerParams(query) });
  }

  setPrizeDelivery(winnerId: string, deliveryStatus: PrizeDeliveryStatus): Observable<void> {
    return this.httpClient
      .patch(`${this.winnersUrl}/${winnerId}/delivery`, { deliveryStatus })
      .pipe(map(() => undefined));
  }

  exportWinners(query: WinnerQuery): Observable<Blob> {
    return this.httpClient.get(`${this.winnersUrl}/export`, {
      params: toWinnerParams(query, { isExport: true }),
      responseType: 'blob',
    });
  }
}
