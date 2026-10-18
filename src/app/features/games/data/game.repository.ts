import { Observable } from 'rxjs';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';

export abstract class GameRepository {
  abstract getGames(query: GameQuery): Observable<GamePage>;
  abstract getSummary(): Observable<GameSummary>;
  abstract getGameDetail(id: string): Observable<GameDetail>;
  abstract createGame(draft: GameDraft): Observable<GameEntry>;
  abstract updateGame(id: string, draft: GameDraft): Observable<GameEntry>;
  abstract deleteGame(id: string): Observable<void>;
  abstract getWinners(query: WinnerQuery): Observable<WinnerPage>;
  abstract setPrizeDelivery(winnerId: string, status: PrizeDeliveryStatus): Observable<void>;
  /** Every winner the filters match; paging is ignored. */
  abstract exportWinners(query: WinnerQuery): Observable<Blob>;
}
