import { formatShortEnglishDate } from './short-english-date';

describe('formatShortEnglishDate', () => {
  it('writes a moment the way the place page does, "Oct 24, 2024"', () => {
    expect(formatShortEnglishDate('2024-10-24T00:00:00.000Z')).toBe('Oct 24, 2024');
  });

  it('reads the day in UTC, so a late-evening moment keeps its date', () => {
    expect(formatShortEnglishDate('2026-01-05T23:30:00.000Z')).toBe('Jan 5, 2026');
  });
});
