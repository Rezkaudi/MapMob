const ISO_DAY_LENGTH = 10;
const PANEL_TIME_ZONE = 'Asia/Damascus';
// "Z" or "+03:00" after the time: the moment can be placed on the Damascus calendar.
const TIME_ZONE_MARK = /T.*(Z|[+-]\d{2}:?\d{2})$/;

// en-CA writes dates as yyyy-mm-dd.
const DAMASCUS_DAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: PANEL_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * The `yyyy-mm-dd` day of a server moment in Damascus time. Some routes send UTC, so a day the
 * admin picked comes back as 21:00 the day before. A value with no time zone is read as written.
 */
export function toIsoDay(moment: string): string {
  if (!TIME_ZONE_MARK.test(moment)) {
    return moment.slice(0, ISO_DAY_LENGTH);
  }
  return DAMASCUS_DAY.format(new Date(moment));
}
