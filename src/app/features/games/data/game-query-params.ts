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
