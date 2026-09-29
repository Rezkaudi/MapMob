/** The place page writes its dates as "Oct 24, 2024": English month, Latin digits. */
const SHORT_ENGLISH_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatShortEnglishDate(value: string): string {
  return SHORT_ENGLISH_DATE_FORMAT.format(new Date(value));
}
