import { Injectable, inject } from '@angular/core';
import { Observable, from, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';
import type { GameMockDatabase } from './game-mock-database';
import { GameRepository } from './game.repository';

@Injectable()
export class GameMockRepository implements GameRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(this.openDatabase()).pipe(shareReplay(1));

  getGames(query: GameQuery): Observable<GamePage> {
    return this.run((database) => database.page(query));
  }

  getSummary(): Observable<GameSummary> {
    return this.run((database) => database.summary());
  }

  getGameDetail(id: string): Observable<GameDetail> {
    return this.run((database) => database.detail(id));
  }

  createGame(draft: GameDraft): Observable<GameEntry> {
    return this.run((database) => database.create(draft));
  }

  updateGame(id: string, draft: GameDraft): Observable<GameEntry> {
    return this.run((database) => database.update(id, draft));
  }

  deleteGame(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  getWinners(query: WinnerQuery): Observable<WinnerPage> {
    return this.run((database) => database.winners(query));
  }

  setPrizeDelivery(winnerId: string, status: PrizeDeliveryStatus): Observable<void> {
    return this.run((database) => database.setDelivery(winnerId, status));
  }

  exportWinners(query: WinnerQuery): Observable<Blob> {
    return this.run((database) => database.exportedWinnersFile(query));
  }

  private async openDatabase(): Promise<GameMockDatabase> {
    const [{ GameMockDatabase }, { buildGameMockSeed }] = await Promise.all([
      import('./game-mock-database'),
      import('./game-mock-seed'),
    ]);
    return new GameMockDatabase(buildGameMockSeed(this.clock()), this.clock);
  }

  private run<T>(work: (database: GameMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
