import {
  describeGameCountdown,
  formatGameClock,
  formatGameDay,
  formatGameTwelveHourTime,
  toGameStartsAt,
  toZonedSchedule,
} from './game-schedule-text';

const DAMASCUS = 'Asia/Damascus';
/** 18:00 in Damascus. */
const STARTS_AT = '2026-10-15T15:00:00.000Z';

describe('game schedule text', () => {
  it('writes the day with Latin digits and the month by name, in the game time zone', () => {
    expect(formatGameDay(STARTS_AT, DAMASCUS)).toBe('15 أكتوبر 2026');
    expect(formatGameDay('2026-10-15T22:30:00.000Z', DAMASCUS)).toBe('16 أكتوبر 2026');
  });

  it('writes the start on a 24-hour clock', () => {
    expect(formatGameClock(STARTS_AT, DAMASCUS)).toBe('18:00');
  });

  it('writes the start on a 12-hour clock with the Arabic evening word, as the table does', () => {
    expect(formatGameTwelveHourTime('2025-10-15T17:00:00.000Z', DAMASCUS)).toBe('8:00 مساء');
    expect(formatGameTwelveHourTime('2025-10-15T06:30:00.000Z', DAMASCUS)).toBe('9:30 صباحاً');
  });

  it('counts the days left before the game', () => {
    const now = new Date('2026-10-11T09:00:00.000Z');
    expect(describeGameCountdown(STARTS_AT, now, DAMASCUS)).toBe('بعد 4 أيام');
    expect(describeGameCountdown('2026-10-11T16:00:00.000Z', now, DAMASCUS)).toBe('اليوم');
    expect(describeGameCountdown('2026-10-12T16:00:00.000Z', now, DAMASCUS)).toBe('غداً');
    expect(describeGameCountdown('2026-10-13T16:00:00.000Z', now, DAMASCUS)).toBe('بعد يومين');
    expect(describeGameCountdown('2026-10-30T16:00:00.000Z', now, DAMASCUS)).toBe('بعد 19 يوماً');
  });

  it('splits a start into the day and time the form fields hold', () => {
    expect(toZonedSchedule(STARTS_AT, DAMASCUS)).toEqual({ day: '2026-10-15', time: '18:00' });
  });

  it('joins the form day and time into an ISO moment with the zone offset', () => {
    expect(toGameStartsAt('2026-10-15', '18:00', '+03:00')).toBe('2026-10-15T18:00:00+03:00');
  });
});
