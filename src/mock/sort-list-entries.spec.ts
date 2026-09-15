import { sortListEntries } from './sort-list-entries';

const OLD_BAKERY = { name: 'مخابز', updatedAt: '2024-01-01T00:00:00.000Z' };
const NEW_CAFE = { name: 'مقاهي', updatedAt: '2024-03-01T00:00:00.000Z' };
const MID_PHARMACY = { name: 'صيدليات', updatedAt: '2024-02-01T00:00:00.000Z' };
const ENTRIES = [OLD_BAKERY, NEW_CAFE, MID_PHARMACY];

describe('sortListEntries', () => {
  it('puts the newest first', () => {
    expect(sortListEntries(ENTRIES, 'newest')).toEqual([NEW_CAFE, MID_PHARMACY, OLD_BAKERY]);
  });

  it('puts the oldest first', () => {
    expect(sortListEntries(ENTRIES, 'oldest')).toEqual([OLD_BAKERY, MID_PHARMACY, NEW_CAFE]);
  });

  it('orders by Arabic name', () => {
    expect(sortListEntries(ENTRIES, 'name')).toEqual([MID_PHARMACY, OLD_BAKERY, NEW_CAFE]);
  });

  it('keeps the given order without a sort, and never changes the input', () => {
    expect(sortListEntries(ENTRIES, undefined)).toEqual(ENTRIES);
    sortListEntries(ENTRIES, 'name');
    expect(ENTRIES).toEqual([OLD_BAKERY, NEW_CAFE, MID_PHARMACY]);
  });

  it('orders by another date when the caller names it', () => {
    const early = { name: 'أحمد', registeredAt: '2024-01-01T00:00:00.000Z' };
    const late = { name: 'سارة', registeredAt: '2024-05-01T00:00:00.000Z' };

    const sorted = sortListEntries([early, late], 'newest', (entry) => entry.registeredAt);

    expect(sorted).toEqual([late, early]);
  });

  it('orders by another name when the caller names it', () => {
    const sara = { userName: 'سارة', createdAt: '2024-01-01T00:00:00.000Z' };
    const ahmad = { userName: 'أحمد', createdAt: '2024-05-01T00:00:00.000Z' };

    const sorted = sortListEntries(
      [sara, ahmad],
      'name',
      (entry) => entry.createdAt,
      (entry) => entry.userName,
    );

    expect(sorted).toEqual([ahmad, sara]);
  });
});
