const PLAIN_SLASH = '/';
/** The subscription frames draw "01 / 09 / 2026". */
export const SPACED_SLASH = ' / ';

/** "07/09/2026" — Latin digits, day before month, the shape the payment detail modal uses. */
export function formatSlashDate(day: string, separator: string = PLAIN_SLASH): string {
  const [year, month, date] = day.split('-');
  return [date, month, year].join(separator);
}
