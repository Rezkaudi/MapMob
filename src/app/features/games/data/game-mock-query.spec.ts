import { buildGame, buildWinner } from '../testing/game-fixture';
import { matchGames, matchWinners } from './game-mock-query';

const OLDER = buildGame({
  id: 'old',
  roundNumber: 98,
  startsAt: '2026-09-01T15:00:00.000Z',
  status: 'finished',
});
const NEWER = buildGame({ id: 'new', roundNumber: 104, startsAt: '2026-10-15T15:00:00.000Z' });
const OTHER = buildGame({
  id: 'other',
  name: 'تحدي الذاكرة',
  roundNumber: 3,
  startsAt: '2026-10-01T15:00:00.000Z',
});

describe('matchGames', () => {
  const games = [OLDER, NEWER, OTHER];

  it('lists the latest start first by default', () => {
    expect(matchGames(games, {}).map((game) => game.id)).toEqual(['new', 'other', 'old']);
  });

  it('can list the earliest first, or by name', () => {
    expect(matchGames(games, { sort: 'oldest' }).map((game) => game.id)).toEqual([
      'old',
      'other',
      'new',
    ]);
    expect(matchGames(games, { sort: 'name' })[0].id).toBe('old');
  });

  it('keeps one status', () => {
    expect(matchGames(games, { status: 'finished' }).map((game) => game.id)).toEqual(['old']);
  });

  it('finds a round by its number, with or without the hash, or a game by name', () => {
    expect(matchGames(games, { search: '104' }).map((game) => game.id)).toEqual(['new']);
    expect(matchGames(games, { search: '#98' }).map((game) => game.id)).toEqual(['old']);
    expect(matchGames(games, { search: 'الذاكرة' }).map((game) => game.id)).toEqual(['other']);
  });
});

describe('matchWinners', () => {
  const winners = [
    buildWinner({
      id: 'a',
      wonOn: '2026-10-01',
      user: { id: 'u1', name: 'سارة علي' },
      phone: '0944000111',
    }),
    buildWinner({ id: 'b', wonOn: '2026-10-05', game: { id: 'g2', name: 'x', roundNumber: 2 } }),
  ];

  it('lists the latest win first and keeps one game', () => {
    expect(matchWinners(winners, {}).map((winner) => winner.id)).toEqual(['b', 'a']);
    expect(matchWinners(winners, { gameId: 'g2' }).map((winner) => winner.id)).toEqual(['b']);
  });

  it('finds a winner by name or phone', () => {
    expect(matchWinners(winners, { search: 'سارة' }).map((winner) => winner.id)).toEqual(['a']);
    expect(matchWinners(winners, { search: '0944' }).map((winner) => winner.id)).toEqual(['a']);
  });
});
