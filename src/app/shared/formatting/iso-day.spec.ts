import { toIsoDay } from './iso-day';

describe('toIsoDay', () => {
  it('keeps the day the server wrote, without moving it to local time', () => {
    expect(toIsoDay('2026-11-03T23:59:59+00:00')).toBe('2026-11-03');
    expect(toIsoDay('2026-10-13T00:00:00.000000Z')).toBe('2026-10-13');
  });
});
