import { toListQueryParams } from './list-query-params';

describe('toListQueryParams', () => {
  it('always sends the page', () => {
    const params = toListQueryParams({ pageIndex: 2, pageSize: 4 });

    expect(params.keys()).toEqual(['pageIndex', 'pageSize']);
    expect(params.get('pageIndex')).toBe('2');
    expect(params.get('pageSize')).toBe('4');
  });

  it('adds the search and the sort only when they are set', () => {
    const params = toListQueryParams({ pageIndex: 0, pageSize: 4, search: 'طلبات', sort: 'name' });

    expect(params.get('search')).toBe('طلبات');
    expect(params.get('sort')).toBe('name');
  });
});
