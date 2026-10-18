import { toGameParams, toWinnerParams } from './game-query-params';

describe('game query params', () => {
  it('sends the paging and leaves out empty filters', () => {
    expect(toGameParams({ pageIndex: 1, pageSize: 3, search: '  ' })).toEqual({
      pageIndex: 1,
      pageSize: 3,
    });
  });

  it('sends the search, status and sort when set', () => {
    expect(
      toGameParams({
        pageIndex: 0,
        pageSize: 3,
        search: '104',
        status: 'finished',
        sort: 'oldest',
      }),
    ).toEqual({ pageIndex: 0, pageSize: 3, search: '104', status: 'finished', sort: 'oldest' });
  });

  it('sends the winner filters, and none of the paging for an export', () => {
    const query = {
      pageIndex: 2,
      pageSize: 4,
      search: 'سارة',
      gameId: 'game-9',
      sort: 'name' as const,
    };
    expect(toWinnerParams(query)).toEqual({
      pageIndex: 2,
      pageSize: 4,
      search: 'سارة',
      gameId: 'game-9',
      sort: 'name',
    });
    expect(toWinnerParams(query, { isExport: true })).toEqual({
      search: 'سارة',
      gameId: 'game-9',
      sort: 'name',
    });
  });
});
