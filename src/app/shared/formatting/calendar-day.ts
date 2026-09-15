const DAY_MS = 86_400_000;
const PADDED_LENGTH = 2;

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** Reads `yyyy-mm-dd` as midnight UTC, so day maths never trips over daylight saving. */
function parseCalendarDay(day: string): number {
  const [year, month, date] = day.split('-').map(Number);
  return Date.UTC(year, month - 1, date);
}

/** The local calendar day of a moment, written `yyyy-mm-dd` like a date input. */
export function toCalendarDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addCalendarDays(day: string, dayCount: number): string {
  const moved = new Date(parseCalendarDay(day) + dayCount * DAY_MS);
  return `${moved.getUTCFullYear()}-${pad(moved.getUTCMonth() + 1)}-${pad(moved.getUTCDate())}`;
}

/** Counts both the first and the last day. */
export function countCalendarDays(from: string, to: string): number {
  return Math.round((parseCalendarDay(to) - parseCalendarDay(from)) / DAY_MS) + 1;
}
