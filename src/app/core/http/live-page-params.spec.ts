import { toLivePageParams } from './live-page-params';

describe('toLivePageParams', () => {
  it('turns the zero-based page into the server page number', () => {
    const params = toLivePageParams({ pageIndex: 2, pageSize: 5 });

    expect(params.get('page')).toBe('3');
    expect(params.get('per_page')).toBe('5');
    expect(params.has('search')).toBe(false);
    expect(params.has('sort_by')).toBe(false);
  });

  it('sends the search and the server sort words', () => {
    expect(toLivePageParams({ pageIndex: 0, pageSize: 5, search: 'حمص' }).get('search')).toBe(
      'حمص',
    );
    expect(toLivePageParams({ pageIndex: 0, pageSize: 5, sort: 'name' }).get('sort_by')).toBe(
      'name_asc',
    );
    expect(toLivePageParams({ pageIndex: 0, pageSize: 5, sort: 'oldest' }).get('sort_by')).toBe(
      'oldest',
    );
  });

  it('sends "latest" for newest, the server word for it', () => {
    expect(toLivePageParams({ pageIndex: 0, pageSize: 5, sort: 'newest' }).get('sort_by')).toBe(
      'latest',
    );
  });
});
