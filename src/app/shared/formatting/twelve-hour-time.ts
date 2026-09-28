const NOON_HOUR = 12;
const PADDED_LENGTH = 2;

interface DayHalfMarkers {
  readonly morning: string;
  readonly evening: string;
}

const LATIN_MARKERS: DayHalfMarkers = { morning: 'AM', evening: 'PM' };
const ARABIC_MARKERS: DayHalfMarkers = { morning: 'ص', evening: 'م' };

function formatOnTwelveHourClock(time: string, markers: DayHalfMarkers): string {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const clockHour = String(hour % NOON_HOUR || NOON_HOUR).padStart(PADDED_LENGTH, '0');
  return `${clockHour}:${minutes} ${hour < NOON_HOUR ? markers.morning : markers.evening}`;
}

/** "08:00 PM" from `20:00`, as the time inputs in the designs show it. */
export function formatTwelveHourTime(time: string): string {
  return formatOnTwelveHourClock(time, LATIN_MARKERS);
}

/** "11:00 م" from `23:00`, as the merchant hours card shows it. */
export function formatArabicTwelveHourTime(time: string): string {
  return formatOnTwelveHourClock(time, ARABIC_MARKERS);
}
