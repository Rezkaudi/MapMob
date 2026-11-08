import { toLiveSort } from './live-list-sort';

describe('toLiveSort', () => {
  it('names every panel sort with the server word, newest included', () => {
    expect(toLiveSort('newest')).toBe('latest');
    expect(toLiveSort('oldest')).toBe('oldest');
    expect(toLiveSort('name')).toBe('name_asc');
  });

  it('sends nothing when no sort is picked', () => {
    expect(toLiveSort(undefined)).toBeUndefined();
    expect(toLiveSort(null)).toBeUndefined();
  });
});
