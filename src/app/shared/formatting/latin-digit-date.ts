/** The designs write dates as "02 سبتمبر 2026": Latin digits, Arabic month names. */
const LATIN_DIGIT_DATE_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatLatinDigitDate(value: string | Date): string {
  return LATIN_DIGIT_DATE_FORMAT.format(new Date(value));
}
