import { formatArabicDate } from '../../../shared/formatting/arabic-date';

/** "١٢ يناير ٢٠٢٤ حتى ٢٦ يناير ٢٠٢٤", or "من ١٢ يناير ٢٠٢٤ (دائم)" for an ad that never ends. */
export function formatAdPeriod(startsOn: string, endsOn: string | null): string {
  const start = formatArabicDate(startsOn);
  return endsOn === null ? `من ${start} (دائم)` : `${start} حتى ${formatArabicDate(endsOn)}`;
}
