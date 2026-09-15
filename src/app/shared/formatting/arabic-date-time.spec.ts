import { formatArabicDateTime } from './arabic-date-time';

describe('formatArabicDateTime', () => {
  it('writes the weekday, the day, the month, the year and the time as the review drawer does', () => {
    expect(formatArabicDateTime(new Date(2026, 8, 7, 20, 42))).toBe(
      'الإثنين 07 سبتمبر 2026 - الساعة 08:42 مساءً',
    );
  });

  it('says "صباحاً" before noon and reads midnight and noon as 12', () => {
    expect(formatArabicDateTime(new Date(2026, 8, 1, 0, 5))).toBe(
      'الثلاثاء 01 سبتمبر 2026 - الساعة 12:05 صباحاً',
    );
    expect(formatArabicDateTime(new Date(2026, 8, 1, 12, 0))).toBe(
      'الثلاثاء 01 سبتمبر 2026 - الساعة 12:00 مساءً',
    );
  });
});
