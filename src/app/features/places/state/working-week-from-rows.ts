import { WorkingDay, WEEK_DAYS, createDefaultWeek } from '../models/working-day';
import { WorkingHoursRow } from '../models/working-hours-row';

const DAY_RANGE_SEPARATOR = '-';
const TODAY_NOTE = /\s*\(.*\)\s*$/;
const TWELVE_HOUR = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
const TWENTY_FOUR_HOUR = /^(\d{1,2}):(\d{2})$/;
const NOON = 12;

/** The saved week as the editor needs it: one entry per day, in the editor's order. */
export function toWorkingWeek(rows: readonly WorkingHoursRow[]): WorkingDay[] {
  if (rows.length === 0) {
    return createDefaultWeek();
  }
  const opened = new Map<string, { opensAt: string; closesAt: string }>();
  for (const row of rows) {
    const hours = toHours(row.hours);
    if (!hours) {
      continue;
    }
    for (const day of toDays(row.days)) {
      opened.set(day, hours);
    }
  }
  return WEEK_DAYS.map((day) => ({
    day,
    isOpen: opened.has(day),
    ...(opened.get(day) ?? { opensAt: '', closesAt: '' }),
  })).map((day) => (day.isOpen ? day : { ...day, ...closedHours(day.day) }));
}

/** A closed day still shows the default times, so the editor has something to open with. */
function closedHours(day: string): { opensAt: string; closesAt: string } {
  const fallback = createDefaultWeek().find((candidate) => candidate.day === day);
  return { opensAt: fallback?.opensAt ?? '', closesAt: fallback?.closesAt ?? '' };
}

function toDays(label: string): readonly string[] {
  const parts = label
    .replace(TODAY_NOTE, '')
    .split(DAY_RANGE_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) {
    return parts.filter((part) => WEEK_DAYS.includes(part as (typeof WEEK_DAYS)[number]));
  }
  return expandRange(parts[0], parts[1]);
}

/** Days run in the editor's order and wrap past the end of the week. */
function expandRange(from: string, to: string): readonly string[] {
  const start = WEEK_DAYS.indexOf(from as (typeof WEEK_DAYS)[number]);
  const end = WEEK_DAYS.indexOf(to as (typeof WEEK_DAYS)[number]);
  if (start < 0 || end < 0) {
    return [];
  }
  const length = ((end - start + WEEK_DAYS.length) % WEEK_DAYS.length) + 1;
  return Array.from({ length }, (_, step) => WEEK_DAYS[(start + step) % WEEK_DAYS.length]);
}

function toHours(label: string): { opensAt: string; closesAt: string } | null {
  const parts = label.split(DAY_RANGE_SEPARATOR).map((part) => part.trim());
  if (parts.length < 2) {
    return null;
  }
  const opensAt = toClockTime(parts[0]);
  const closesAt = toClockTime(parts[1]);
  if (!opensAt || !closesAt) {
    return null;
  }
  return { opensAt, closesAt };
}

function toClockTime(label: string): string {
  const twelveHour = TWELVE_HOUR.exec(label);
  if (twelveHour) {
    const [, hour, minute, meridiem] = twelveHour;
    return `${pad(toTwentyFourHour(Number(hour), meridiem))}:${minute}`;
  }
  const twentyFourHour = TWENTY_FOUR_HOUR.exec(label);
  if (twentyFourHour) {
    return `${pad(Number(twentyFourHour[1]))}:${twentyFourHour[2]}`;
  }
  return '';
}

function toTwentyFourHour(hour: number, meridiem: string): number {
  const isAfternoon = meridiem.toUpperCase() === 'PM';
  if (hour === NOON) {
    return isAfternoon ? NOON : 0;
  }
  return isAfternoon ? hour + NOON : hour;
}

function pad(hour: number): string {
  return String(hour).padStart(2, '0');
}
