import { toLiveFilterParams } from './live-filter-params';

describe('toLiveFilterParams', () => {
  it('keeps every filter that has a value, in order', () => {
    const params = toLiveFilterParams({ search: 'حمص', rating: 5, status: 'hidden' });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['search', 'حمص'],
      ['rating', '5'],
      ['status', 'hidden'],
    ]);
  });

  it('leaves out filters with no value', () => {
    const params = toLiveFilterParams({
      search: '',
      status: null,
      rating: undefined,
      type: 'video',
    });

    expect(params.keys()).toEqual(['type']);
  });

  it('keeps a zero, which is a real value', () => {
    expect(toLiveFilterParams({ is_active: 0 }).get('is_active')).toBe('0');
  });
});
