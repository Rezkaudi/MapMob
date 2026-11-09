import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { GameQuery } from '../models/game-query';
import { GameStatus } from '../models/game-status';
import { WinnerQuery } from '../models/winner-query';
import { LiveGameStatus } from './live-game';

const LIVE_GAME_STATUS: Record<GameStatus, LiveGameStatus> = {
  scheduled: 'scheduled',
  active: 'active',
  finished: 'completed',
};

/** The list filters and sort; the page is added by the caller. */
export function toGameListParams(query: GameQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search?.trim(),
    status: query.status ? LIVE_GAME_STATUS[query.status] : null,
    sort_by: toLiveSort(query.sort),
  });
}

/** The list and the export send the same filters and sort; the page is added by the caller. */
export function toWinnerListParams(query: WinnerQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search?.trim(),
    game_id: query.gameId,
    sort_by: toLiveSort(query.sort),
  });
}
