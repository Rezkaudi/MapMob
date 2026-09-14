import { queryRegionEntries } from './region-mock-query';

const ENTRIES = [
  { id: '1', name: 'حمص', updatedAt: '2024-01-10T00:00:00.000Z' },
  { id: '2', name: 'طرطوس', updatedAt: '2024-03-10T00:00:00.000Z' },
  { id: '3', name: 'اللاذقية', updatedAt: '2024-02-10T00:00:00.000Z' },
];

describe('queryRegionEntries', () => {
  it('keeps the stored order when no sort is picked', () => {
    const page = queryRegionEntries(ENTRIES, { pageIndex: 0, pageSize: 10 });

    expect(page.items.map((entry) => entry.id)).toEqual(['1', '2', '3']);
  });

  it('filters by name', () => {
    const page = queryRegionEntries(ENTRIES, { pageIndex: 0, pageSize: 10, search: 'طرط' });

    expect(page).toEqual({ items: [ENTRIES[1]], totalCount: 1 });
  });

  it('sorts newest first, oldest first, or by name', () => {
    const idsFor = (sort: 'newest' | 'oldest' | 'name') =>
      queryRegionEntries(ENTRIES, { pageIndex: 0, pageSize: 10, sort }).items.map(
        (entry) => entry.id,
      );

    expect(idsFor('newest')).toEqual(['2', '3', '1']);
    expect(idsFor('oldest')).toEqual(['1', '3', '2']);
    expect(idsFor('name')).toEqual(['3', '1', '2']);
  });

  it('cuts out the requested page', () => {
    const page = queryRegionEntries(ENTRIES, { pageIndex: 1, pageSize: 2 });

    expect(page).toEqual({ items: [ENTRIES[2]], totalCount: 3 });
  });
});
