import { addCalendarDays, countCalendarDays, toCalendarDay } from './calendar-day';

describe('calendar days', () => {
  it('writes a local date as yyyy-mm-dd', () => {
    expect(toCalendarDay(new Date(2026, 8, 2, 23, 30))).toBe('2026-09-02');
  });

  it('moves a day forwards and backwards across month ends', () => {
    expect(addCalendarDays('2026-09-02', -6)).toBe('2026-08-27');
    expect(addCalendarDays('2026-08-31', 1)).toBe('2026-09-01');
  });

  it('counts both ends of a range', () => {
    expect(countCalendarDays('2026-08-01', '2026-09-02')).toBe(33);
    expect(countCalendarDays('2026-09-02', '2026-09-02')).toBe(1);
  });
});
