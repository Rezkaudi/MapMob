import { GameQuery } from '../models/game-query';
import { WinnerQuery } from '../models/winner-query';

type QueryParams = Record<string, string | number>;

interface ParamOptions {
  /** An export always returns every matching row, so it sends no paging. */
  readonly isExport?: boolean;
}

function withoutEmpty(values: Record<string, string | number | undefined>): QueryParams {
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string | number] =>
        entry[1] !== undefined && String(entry[1]).trim() !== '',
    ),
  );
}

function pagingOf(query: GameQuery | WinnerQuery, options: ParamOptions) {
  return options.isExport ? {} : { pageIndex: query.pageIndex, pageSize: query.pageSize };
}

export function toGameParams(query: GameQuery): QueryParams {
  return withoutEmpty({
    ...pagingOf(query, {}),
    search: query.search?.trim(),
    status: query.status,
    sort: query.sort,
  });
}

export function toWinnerParams(query: WinnerQuery, options: ParamOptions = {}): QueryParams {
  return withoutEmpty({
    ...pagingOf(query, options),
    search: query.search?.trim(),
    gameId: query.gameId,
    sort: query.sort,
  });
}
