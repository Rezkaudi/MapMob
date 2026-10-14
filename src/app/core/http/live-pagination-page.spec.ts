import { toPagedResultFromPagination } from './live-pagination-page';

describe('toPagedResultFromPagination', () => {
  it('maps each row and reads the total from pagination', () => {
    expect(
      toPagedResultFromPagination(
        { data: [{ id: 1 }], pagination: { total: 9 } },
        (row) => String(row.id),
      ),
    ).toEqual({ items: ['1'], totalCount: 9 });
  });
});
