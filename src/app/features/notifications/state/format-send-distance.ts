import {
  CountWords,
  DAY_WORDS,
  HOUR_WORDS,
  MINUTE_WORDS,
  MONTH_WORDS,
  WEEK_WORDS,
  YEAR_WORDS,
  formatArabicCount,
} from '../../../shared/formatting/arabic-count';
import { toSendDate } from './send-moment';

const MINUTE_MS = 60_000;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;
const NOW_LABEL = 'الآن';
const AHEAD_WORD = 'متبقي';
const AGO_WORD = 'منذ';

function describeMinutes(minutes: number): string {
  const days = Math.floor(minutes / MINUTES_PER_DAY);
  const count = (value: number, words: CountWords) => formatArabicCount(value, words);
  if (minutes < MINUTES_PER_HOUR) {
    return count(minutes, MINUTE_WORDS);
  }
  if (days < 1) {
    return count(Math.floor(minutes / MINUTES_PER_HOUR), HOUR_WORDS);
  }
  if (days < DAYS_PER_WEEK) {
    return count(days, DAY_WORDS);
  }
  if (days < DAYS_PER_MONTH) {
    return count(Math.floor(days / DAYS_PER_WEEK), WEEK_WORDS);
  }
  if (days < DAYS_PER_YEAR) {
    return count(Math.floor(days / DAYS_PER_MONTH), MONTH_WORDS);
  }
  return count(Math.floor(days / DAYS_PER_YEAR), YEAR_WORDS);
}

/** "متبقي يومين" before a send, "منذ أسبوع" after it. */
export function formatSendDistance(sendAt: string, now: Date): string {
  const minutes = Math.round((toSendDate(sendAt).getTime() - now.getTime()) / MINUTE_MS);
  if (minutes === 0) {
    return NOW_LABEL;
  }
  const word = minutes > 0 ? AHEAD_WORD : AGO_WORD;
  return `${word} ${describeMinutes(Math.abs(minutes))}`;
}
