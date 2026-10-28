import { ListSort } from '../../../shared/models/list-sort';
import { GameEntry } from '../models/game-entry';
import { GameQuery } from '../models/game-query';
import { GameWinner } from '../models/game-winner';
import { WinnerQuery } from '../models/winner-query';

const ROUND_MARK = '#';

type GameFilters = Partial<Pick<GameQuery, 'search' | 'status' | 'sort'>>;
type WinnerFilters = Partial<Pick<WinnerQuery, 'search' | 'gameId' | 'sort'>>;

function compareGames(left: GameEntry, right: GameEntry, sort: ListSort): number {
  if (sort === 'name') {
    return left.name.localeCompare(right.name, 'ar') || left.roundNumber - right.roundNumber;
  }
  const byStart = left.startsAt.localeCompare(right.startsAt);
  return sort === 'oldest' ? byStart : -byStart;
}

function isGameFound(game: GameEntry, search: string): boolean {
  const round = search.startsWith(ROUND_MARK) ? search.slice(ROUND_MARK.length) : search;
  return String(game.roundNumber).includes(round) || game.name.includes(search);
}

export function matchGames<T extends GameEntry>(games: readonly T[], filters: GameFilters): T[] {
  const search = filters.search?.trim() ?? '';
  return games
    .filter((game) => !filters.status || game.status === filters.status)
    .filter((game) => !search || isGameFound(game, search))
    .sort((left, right) => compareGames(left, right, filters.sort ?? 'newest'));
}

function compareWinners(left: GameWinner, right: GameWinner, sort: ListSort): number {
  if (sort === 'name') {
    return left.user.name.localeCompare(right.user.name, 'ar');
  }
  const byDay = left.wonOn.localeCompare(right.wonOn);
  return sort === 'oldest' ? byDay : -byDay;
}

export function matchWinners(winners: readonly GameWinner[], filters: WinnerFilters): GameWinner[] {
  const search = filters.search?.trim() ?? '';
  return winners
    .filter((winner) => !filters.gameId || winner.game.id === filters.gameId)
    .filter(
      (winner) =>
        !search || winner.user.name.includes(search) || (winner.phone ?? '').includes(search),
    )
    .sort((left, right) => compareWinners(left, right, filters.sort ?? 'newest'));
}
