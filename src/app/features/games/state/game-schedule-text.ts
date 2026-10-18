import { DAY_WORDS, formatArabicCount } from '../../../shared/formatting/arabic-count';

const NOON_HOUR = 12;
const PADDED_LENGTH = 2;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MORNING_WORD = 'صباحاً';
const EVENING_WORD = 'مساء';
const TODAY_WORD = 'اليوم';
const TOMORROW_WORD = 'غداً';

interface ZonedParts {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly hour: number;
  readonly minute: string;
}

/** The day and time the form fields hold, in the game's own zone. */
export interface ZonedSchedule {
  /** yyyy-mm-dd. */
  readonly day: string;
  /** HH:mm. */
  readonly time: string;
}

const dayFormats = new Map<string, Intl.DateTimeFormat>();
const partFormats = new Map<string, Intl.DateTimeFormat>();

function dayFormatFor(timeZone: string): Intl.DateTimeFormat {
  let format = dayFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    });
    dayFormats.set(timeZone, format);
  }
  return format;
}

function partFormatFor(timeZone: string): Intl.DateTimeFormat {
  let format = partFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone,
    });
    partFormats.set(timeZone, format);
  }
  return format;
}

function zonedParts(moment: string | Date, timeZone: string): ZonedParts {
  const parts = partFormatFor(timeZone).formatToParts(new Date(moment));
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return {
    year: valueOf('year'),
    month: valueOf('month'),
    day: valueOf('day'),
    hour: Number(valueOf('hour')),
    minute: valueOf('minute'),
  };
}

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** "15 أكتوبر 2026". */
export function formatGameDay(startsAt: string, timeZone: string): string {
  return dayFormatFor(timeZone).format(new Date(startsAt));
}

/** "18:00". */
export function formatGameClock(startsAt: string, timeZone: string): string {
  const { hour, minute } = zonedParts(startsAt, timeZone);
  return `${pad(hour)}:${minute}`;
}

/** "8:00 مساء", as the games table writes it. */
export function formatGameTwelveHourTime(startsAt: string, timeZone: string): string {
  const { hour, minute } = zonedParts(startsAt, timeZone);
  const clockHour = hour % NOON_HOUR || NOON_HOUR;
  return `${clockHour}:${minute} ${hour < NOON_HOUR ? MORNING_WORD : EVENING_WORD}`;
}

export function toZonedSchedule(startsAt: string, timeZone: string): ZonedSchedule {
  const { year, month, day, hour, minute } = zonedParts(startsAt, timeZone);
  return { day: `${year}-${month}-${day}`, time: `${pad(hour)}:${minute}` };
}

export function toGameStartsAt(day: string, time: string, utcOffset: string): string {
  return `${day}T${time}:00${utcOffset}`;
}

function calendarDayNumber(moment: string | Date, timeZone: string): number {
  const { day } = toZonedSchedule(new Date(moment).toISOString(), timeZone);
  return Date.parse(`${day}T00:00:00Z`) / MILLISECONDS_PER_DAY;
}

/** "بعد 4 أيام", counted in calendar days of the game's zone. */
export function describeGameCountdown(startsAt: string, now: Date, timeZone: string): string {
  const daysLeft = calendarDayNumber(startsAt, timeZone) - calendarDayNumber(now, timeZone);
  if (daysLeft <= 0) {
    return TODAY_WORD;
  }
  if (daysLeft === 1) {
    return TOMORROW_WORD;
  }
  return `بعد ${formatArabicCount(daysLeft, DAY_WORDS)}`;
}
