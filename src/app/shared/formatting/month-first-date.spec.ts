import { formatMonthFirstDate } from './month-first-date';

describe('formatMonthFirstDate', () => {
  it('writes a calendar day month first, as the date inputs in the designs show it', () => {
    expect(formatMonthFirstDate('2026-05-18')).toBe('05/18/2026');
  });
});
