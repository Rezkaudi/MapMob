import { formatSendDistance } from './format-send-distance';

const NOW = new Date(2026, 8, 8, 10, 0);

describe('formatSendDistance', () => {
  it('counts what is left before a future send', () => {
    expect(formatSendDistance('2026-09-10T10:00', NOW)).toBe('متبقي يومين');
    expect(formatSendDistance('2026-09-08T13:00', NOW)).toBe('متبقي 3 ساعات');
    expect(formatSendDistance('2026-09-08T10:20', NOW)).toBe('متبقي 20 دقيقة');
  });

  it('counts how long ago a past send went out, in weeks from seven days', () => {
    expect(formatSendDistance('2026-09-01T10:00', NOW)).toBe('منذ أسبوع');
    expect(formatSendDistance('2026-08-18T10:00', NOW)).toBe('منذ 3 أسابيع');
    expect(formatSendDistance('2026-07-01T10:00', NOW)).toBe('منذ شهرين');
    expect(formatSendDistance('2024-09-01T10:00', NOW)).toBe('منذ سنتين');
  });

  it('says "الآن" inside the same minute', () => {
    expect(formatSendDistance('2026-09-08T10:00', NOW)).toBe('الآن');
  });
});
