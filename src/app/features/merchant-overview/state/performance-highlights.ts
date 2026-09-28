import { VIEW_WORDS, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { PeakViewDay } from '../models/store-performance';

const NO_VALUE = '—';

// "الخميس 24 يوليو": weekday, Latin day, Arabic month, and no comma between them.
const PEAK_DAY_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export function describeDailyAverage(viewCount: number): string {
  return `${formatArabicCount(viewCount, VIEW_WORDS)} / يوم`;
}

export function describePeakDay(peakDay: PeakViewDay | null): string {
  if (!peakDay) {
    return NO_VALUE;
  }
  const parts = PEAK_DAY_FORMAT.formatToParts(new Date(peakDay.on));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((one) => one.type === type)?.value ?? '';
  const day = `${part('weekday')} ${part('day')} ${part('month')}`;
  return `${day} (${formatArabicCount(peakDay.viewCount, VIEW_WORDS)})`;
}
