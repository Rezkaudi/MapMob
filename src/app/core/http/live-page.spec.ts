import { toPagedResult } from './live-page';

describe('toPagedResult', () => {
  it('maps each row and reads the total from meta', () => {
    expect(
      toPagedResult({ data: [{ id: 1 }], meta: { total: 9 } }, (row) => String(row.id)),
    ).toEqual({
      items: ['1'],
      totalCount: 9,
    });
  });
});
