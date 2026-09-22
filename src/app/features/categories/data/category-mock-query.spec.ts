import { buildCategory } from '../testing/category-fixture';
import { queryCategories } from './category-mock-query';

const RESTAURANTS = buildCategory({
  id: 'm1',
  name: 'مطاعم',
  updatedAt: '2024-01-01T00:00:00.000Z',
});
const CAFES = buildCategory({ id: 'm2', name: 'مقاهي', status: 'suspended', icon: 'coffee', color: '#0583EC' });
const SEAFOOD = buildCategory({
  id: 's1',
  name: 'مطاعم بحرية',
  kind: 'sub',
  parentId: 'm1',
  parentName: 'مطاعم',
  updatedAt: '2024-03-01T00:00:00.000Z',
});
const ROASTERY = buildCategory({ id: 's2', name: 'محمصة', kind: 'sub', parentId: 'm2' });
const ALL = [RESTAURANTS, CAFES, SEAFOOD, ROASTERY];
const FIRST_PAGE = { pageIndex: 0, pageSize: 5 };

describe('queryCategories', () => {
  it('returns every category with the count of each kind', () => {
    const page = queryCategories(ALL, FIRST_PAGE);

    expect(page.items).toEqual(ALL);
    expect(page.totalCount).toBe(4);
    expect(page.kindCounts).toEqual({ all: 4, main: 2, sub: 2 });
  });

  it('keeps one kind, while the counts still cover both kinds', () => {
    const page = queryCategories(ALL, { ...FIRST_PAGE, kind: 'sub' });

    expect(page.items).toEqual([SEAFOOD, ROASTERY]);
    expect(page.kindCounts).toEqual({ all: 4, main: 2, sub: 2 });
  });

  it('narrows the rows and the counts by search and status', () => {
    const page = queryCategories(ALL, { ...FIRST_PAGE, search: ' مطاعم ', status: 'active' });

    expect(page.items).toEqual([RESTAURANTS, SEAFOOD]);
    expect(page.kindCounts).toEqual({ all: 2, main: 1, sub: 1 });
  });

  it('shows a main category together with its sub categories', () => {
    expect(queryCategories(ALL, { ...FIRST_PAGE, parentId: 'm1' }).items).toEqual([
      RESTAURANTS,
      SEAFOOD,
    ]);
  });

  it('sorts, then pages', () => {
    const page = queryCategories(ALL, { pageIndex: 0, pageSize: 1, sort: 'newest' });

    expect(page.items).toEqual([SEAFOOD]);
    expect(page.totalCount).toBe(4);
  });
});
