import { toWinnerExportParams } from './game-query-params';

describe('toWinnerExportParams', () => {
  it('sends the search and game in the server names, and no paging', () => {
    expect(
      toWinnerExportParams({
        pageIndex: 2,
        pageSize: 4,
        search: ' سارة ',
        gameId: '9',
        sort: 'name',
      }),
    ).toEqual({ search: 'سارة', game_id: '9' });
  });

  it('leaves out empty filters', () => {
    expect(toWinnerExportParams({ pageIndex: 0, pageSize: 4, search: '  ' })).toEqual({});
  });
});
