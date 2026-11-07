import { toIsoDay } from './iso-day';

describe('toIsoDay', () => {
  it('reads a UTC moment as its day in Damascus, where the admin picked it', () => {
    // A day picked as 7 November is stored as Damascus midnight, which is 21:00 UTC the day before.
    expect(toIsoDay('2026-11-06T21:00:00.000000Z')).toBe('2026-11-07');
    expect(toIsoDay('2026-11-24T21:00:00Z')).toBe('2026-11-25');
  });

  it('keeps the day of a moment written in Damascus time', () => {
    expect(toIsoDay('2026-11-07T00:00:00+03:00')).toBe('2026-11-07');
    expect(toIsoDay('2026-12-07T23:59:59+03:00')).toBe('2026-12-07');
  });

  it('keeps a day or a time that has no time zone as written', () => {
    expect(toIsoDay('2026-11-07')).toBe('2026-11-07');
    expect(toIsoDay('2026-11-07 00:00:00')).toBe('2026-11-07');
  });
});
