import { toStoryQueryParams } from './story-query-params';

describe('toStoryQueryParams', () => {
  it('always sends the page and its size', () => {
    const params = toStoryQueryParams({ pageIndex: 2, pageSize: 4 });

    expect(params.keys().sort()).toEqual(['pageIndex', 'pageSize']);
    expect(params.get('pageIndex')).toBe('2');
    expect(params.get('pageSize')).toBe('4');
  });

  it('adds the search and the status only when they are set', () => {
    const params = toStoryQueryParams({
      pageIndex: 0,
      pageSize: 4,
      search: 'كافيه',
      status: 'hidden',
    });

    expect(params.get('search')).toBe('كافيه');
    expect(params.get('status')).toBe('hidden');
  });
});
