/** Dates in the designs read as "١٢ يناير ٢٠٢٤" — Arabic-Indic digits with Levantine month names. */
const ARABIC_DATE_FORMAT = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatArabicDate(value: string | Date): string {
  return ARABIC_DATE_FORMAT.format(new Date(value));
}
