import { DAY_WORDS, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { countCalendarDays } from '../../../shared/formatting/calendar-day';
import { formatLatinDigitDate } from '../../../shared/formatting/latin-digit-date';

const FULL_PERCENT = 100;

export interface SubscriptionWindow {
  readonly startsOn: string;
  readonly endsOn: string;
}

export interface SubscriptionProgress {
  readonly consumedPercent: number;
  readonly remainingDays: number;
  readonly consumedText: string;
  readonly remainingText: string;
  readonly periodText: string;
}

function clamp(value: number, lowest: number, highest: number): number {
  return Math.min(highest, Math.max(lowest, value));
}

/** Today counts as used, so 26 July of a calendar-year plan is day 207 of 365. */
export function describeSubscriptionProgress(
  window: SubscriptionWindow,
  today: string,
): SubscriptionProgress {
  const totalDays = countCalendarDays(window.startsOn, window.endsOn);
  const usedDays = clamp(countCalendarDays(window.startsOn, today), 0, totalDays);
  const consumedPercent = Math.round((usedDays / totalDays) * FULL_PERCENT);
  const remainingDays = totalDays - usedDays;
  return {
    consumedPercent,
    remainingDays,
    consumedText: `تم استهلاك ${consumedPercent}%`,
    remainingText: `متبقي ${formatArabicCount(remainingDays, DAY_WORDS)}`,
    periodText: `${formatLatinDigitDate(window.startsOn)} — ${formatLatinDigitDate(window.endsOn)}`,
  };
}
