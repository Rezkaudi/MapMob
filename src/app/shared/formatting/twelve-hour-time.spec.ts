import { formatTwelveHourTime } from './twelve-hour-time';

describe('formatTwelveHourTime', () => {
  it('writes a 24-hour time on a 12-hour clock', () => {
    expect(formatTwelveHourTime('20:00')).toBe('08:00 PM');
    expect(formatTwelveHourTime('04:30')).toBe('04:30 AM');
    expect(formatTwelveHourTime('00:15')).toBe('12:15 AM');
    expect(formatTwelveHourTime('12:05')).toBe('12:05 PM');
  });
});
