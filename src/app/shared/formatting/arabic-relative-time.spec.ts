import { formatArabicRelativeTime } from './arabic-relative-time';

const NOW = new Date('2026-09-15T12:00:00.000Z');
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function ago(milliseconds: number): string {
  return new Date(NOW.getTime() - milliseconds).toISOString();
}

describe('formatArabicRelativeTime', () => {
  it('says "الآن" for anything under a minute, or a time in the future', () => {
    expect(formatArabicRelativeTime(ago(30_000), NOW)).toBe('الآن');
    expect(formatArabicRelativeTime(ago(-HOUR_MS), NOW)).toBe('الآن');
  });

  it('uses the single, dual and plural Arabic forms', () => {
    expect(formatArabicRelativeTime(ago(MINUTE_MS), NOW)).toBe('منذ دقيقة');
    expect(formatArabicRelativeTime(ago(2 * MINUTE_MS), NOW)).toBe('منذ دقيقتين');
    expect(formatArabicRelativeTime(ago(10 * MINUTE_MS), NOW)).toBe('منذ 10 دقائق');
    expect(formatArabicRelativeTime(ago(25 * MINUTE_MS), NOW)).toBe('منذ 25 دقيقة');
    expect(formatArabicRelativeTime(ago(HOUR_MS), NOW)).toBe('منذ ساعة');
    expect(formatArabicRelativeTime(ago(2 * HOUR_MS), NOW)).toBe('منذ ساعتين');
    expect(formatArabicRelativeTime(ago(5 * HOUR_MS), NOW)).toBe('منذ 5 ساعات');
    expect(formatArabicRelativeTime(ago(DAY_MS), NOW)).toBe('منذ يوم');
    expect(formatArabicRelativeTime(ago(2 * DAY_MS), NOW)).toBe('منذ يومين');
    expect(formatArabicRelativeTime(ago(3 * DAY_MS), NOW)).toBe('منذ 3 أيام');
    expect(formatArabicRelativeTime(ago(20 * DAY_MS), NOW)).toBe('منذ 20 يوماً');
  });

  it('moves up to months and years for older times', () => {
    expect(formatArabicRelativeTime(ago(45 * DAY_MS), NOW)).toBe('منذ شهر');
    expect(formatArabicRelativeTime(ago(4 * 30 * DAY_MS), NOW)).toBe('منذ 4 أشهر');
    expect(formatArabicRelativeTime(ago(400 * DAY_MS), NOW)).toBe('منذ سنة');
    expect(formatArabicRelativeTime(ago(3 * 365 * DAY_MS), NOW)).toBe('منذ 3 سنوات');
  });
});
