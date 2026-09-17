import { formatSendTime } from './format-send-time';

describe('formatSendTime', () => {
  it('writes the wall-clock send time the way the design does', () => {
    expect(formatSendTime('2026-09-10T10:00')).toBe('10 سبتمبر 2026- 10:00 صباحاً');
    expect(formatSendTime('2026-01-05T16:30')).toBe('5 يناير 2026- 04:30 مساءً');
  });

  it('reads midnight as 12 in the morning and noon as 12 in the evening', () => {
    expect(formatSendTime('2026-09-10T00:05')).toBe('10 سبتمبر 2026- 12:05 صباحاً');
    expect(formatSendTime('2026-09-10T12:00')).toBe('10 سبتمبر 2026- 12:00 مساءً');
  });
});
