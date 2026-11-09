import { toWinnerListParams } from './game-query-params';

describe('toWinnerListParams', () => {
  it('sends the search, game and sort in the server names, and no paging', () => {
    const params = toWinnerListParams({
      pageIndex: 2,
      pageSize: 4,
      search: ' سارة ',
      gameId: '9',
      sort: 'name',
    });

    expect(params.keys().sort()).toEqual(['game_id', 'search', 'sort_by']);
    expect(params.get('search')).toBe('سارة');
    expect(params.get('game_id')).toBe('9');
    expect(params.get('sort_by')).toBe('name_asc');
  });

  it('leaves out empty filters', () => {
    expect(toWinnerListParams({ pageIndex: 0, pageSize: 4, search: '  ' }).keys()).toEqual([]);
  });
});
