import { CountWords, formatArabicCount } from './arabic-count';
import { addCalendarDays, toCalendarDay } from './calendar-day';
import { formatSlashDate } from './slash-date';
import { formatTwelveHourTime } from './twelve-hour-time';

const MINUTE_MS = 60_000;
const MINUTES_PER_HOUR = 60;
const PADDED_LENGTH = 2;
const TODAY_WORD = 'اليوم';
const YESTERDAY_WORD = 'أمس';
const ENDS_SOON_TEXT = 'تنتهي قريباً';
const DAY_TIME_SEPARATOR = ' • ';

/** "متبقي …" takes the subject form: ساعتان, not ساعتين. */
const HOURS_LEFT_WORDS: CountWords = {
  one: 'ساعة واحدة',
  two: 'ساعتان',
  few: 'ساعات',
  many: 'ساعة',
};
const MINUTES_LEFT_WORDS: CountWords = {
  one: 'دقيقة واحدة',
  two: 'دقيقتان',
  few: 'دقائق',
  many: 'دقيقة',
};

const MONTH_NAME_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', { month: 'long' });

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** The viewer's own wall clock, written "22:05". */
function clockTimeOf(moment: Date): string {
  return `${pad(moment.getHours())}:${pad(moment.getMinutes())}`;
}

function dayAndMonthOf(moment: Date): string {
  return `${moment.getDate()} ${MONTH_NAME_FORMAT.format(moment)}`;
}

/** "متبقي 14 ساعة": whole hours left, then minutes in the last hour. */
export function describeRemainingTime(expiresAt: string, now: Date): string {
  const minutesLeft = Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / MINUTE_MS);
  if (minutesLeft <= 0) {
    return ENDS_SOON_TEXT;
  }
  if (minutesLeft < MINUTES_PER_HOUR) {
    return `متبقي ${formatArabicCount(minutesLeft, MINUTES_LEFT_WORDS)}`;
  }
  const hoursLeft = Math.floor(minutesLeft / MINUTES_PER_HOUR);
  return `متبقي ${formatArabicCount(hoursLeft, HOURS_LEFT_WORDS)}`;
}

/** "اليوم", "أمس" or "18 سبتمبر". */
export function describeStoryDay(moment: string, now: Date): string {
  const day = toCalendarDay(new Date(moment));
  const today = toCalendarDay(now);
  if (day === today) {
    return TODAY_WORD;
  }
  return day === addCalendarDays(today, -1) ? YESTERDAY_WORD : dayAndMonthOf(new Date(moment));
}

/** "اليوم • 10:30 AM", under an active card. */
export function formatStoryPublishedTime(publishedAt: string, now: Date): string {
  const time = formatTwelveHourTime(clockTimeOf(new Date(publishedAt)));
  return `${describeStoryDay(publishedAt, now)}${DAY_TIME_SEPARATOR}${time}`;
}

/** "18 أكتوبر • 02:00 PM", in the grey box of an expired card. */
export function formatStoryDayTime(moment: string): string {
  const date = new Date(moment);
  return `${dayAndMonthOf(date)}${DAY_TIME_SEPARATOR}${formatTwelveHourTime(clockTimeOf(date))}`;
}

/** "30/09/2026 - 10:30", in the drawer. */
export function formatStoryMoment(moment: string): string {
  const date = new Date(moment);
  return `${formatSlashDate(toCalendarDay(date))} - ${clockTimeOf(date)}`;
}
