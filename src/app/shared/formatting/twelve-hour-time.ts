const NOON_HOUR = 12;
const PADDED_LENGTH = 2;

/** "08:00 PM" from `20:00`, as the time inputs in the designs show it. */
export function formatTwelveHourTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const clockHour = String(hour % NOON_HOUR || NOON_HOUR).padStart(PADDED_LENGTH, '0');
  return `${clockHour}:${minutes} ${hour < NOON_HOUR ? 'AM' : 'PM'}`;
}
