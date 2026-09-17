import { toWallClockTime } from './wall-clock-time';

describe('toWallClockTime', () => {
  it('writes a local moment as `yyyy-mm-ddThh:mm`', () => {
    expect(toWallClockTime(new Date(2026, 8, 8, 7, 5))).toBe('2026-09-08T07:05');
  });
});
