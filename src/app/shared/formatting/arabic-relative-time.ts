import {
  DAY_WORDS,
  HOUR_WORDS,
  MINUTE_WORDS,
  MONTH_WORDS,
  WEEK_WORDS,
  YEAR_WORDS,
  formatArabicCount,
} from './arabic-count';

const MINUTE_MS = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;
const JUST_NOW_LABEL = 'الآن';

export interface RelativeTimeOptions {
  /** The merchant products table says "منذ أسبوع" where other pages say "منذ 7 أيام". */
  readonly isWeekCounted: boolean;
}

/** Writes how long ago a moment was, the way the design does: "منذ 10 دقائق", "منذ يومين". */
export function formatArabicRelativeTime(
  isoDate: string,
  now: Date,
  options: RelativeTimeOptions = { isWeekCounted: false },
): string {
  const minutes = Math.floor((now.getTime() - new Date(isoDate).getTime()) / MINUTE_MS);
  if (minutes < 1) {
    return JUST_NOW_LABEL;
  }
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const days = Math.floor(hours / HOURS_PER_DAY);
  if (hours < 1) {
    return `منذ ${formatArabicCount(minutes, MINUTE_WORDS)}`;
  }
  if (days < 1) {
    return `منذ ${formatArabicCount(hours, HOUR_WORDS)}`;
  }
  if (days < DAYS_PER_WEEK || (days < DAYS_PER_MONTH && !options.isWeekCounted)) {
    return `منذ ${formatArabicCount(days, DAY_WORDS)}`;
  }
  if (days < DAYS_PER_MONTH) {
    return `منذ ${formatArabicCount(Math.floor(days / DAYS_PER_WEEK), WEEK_WORDS)}`;
  }
  if (days < DAYS_PER_YEAR) {
    return `منذ ${formatArabicCount(Math.floor(days / DAYS_PER_MONTH), MONTH_WORDS)}`;
  }
  return `منذ ${formatArabicCount(Math.floor(days / DAYS_PER_YEAR), YEAR_WORDS)}`;
}
