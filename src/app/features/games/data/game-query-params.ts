import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { GameQuery } from '../models/game-query';
import { WinnerQuery } from '../models/winner-query';

type QueryParams = Record<string, string>;

/** The export returns every matching winner, so it sends filters only. */
export function toWinnerExportParams(query: WinnerQuery): QueryParams {
  const search = query.search?.trim();
  return {
    ...(search ? { search } : {}),
    ...(query.gameId ? { game_id: query.gameId } : {}),
  };
}

// The server filters status by the saved state and searches names only, which would hide
// games the panel shows; so the list sends the sort and filters the rest here.
export function toGameListParams(query: GameQuery): HttpParams {
  return toLiveFilterParams({ sort_by: toLiveSort(query.sort) });
}

export function toWinnerListParams(query: WinnerQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search?.trim(),
    game_id: query.gameId,
    sort_by: toLiveSort(query.sort),
  });
}
