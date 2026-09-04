import { paginate } from './paginate';

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns a page of items and the total count', () => {
    const result = paginate(items, 0, 10);

    expect(result.items).toEqual(items.slice(0, 10));
    expect(result.totalCount).toBe(25);
  });

  it('returns the last partial page', () => {
    const result = paginate(items, 2, 10);

    expect(result.items).toEqual([21, 22, 23, 24, 25]);
  });

  it('returns an empty page past the end', () => {
    const result = paginate(items, 5, 10);

    expect(result.items).toEqual([]);
    expect(result.totalCount).toBe(25);
  });
});
