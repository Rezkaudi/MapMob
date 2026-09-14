import { DAY_WORDS, formatArabicCount } from '../../../../shared/formatting/arabic-count';
import { countCalendarDays } from '../../../../shared/formatting/calendar-day';
import { DateRange } from '../../models/date-range';

const MONTH_NAME_FORMAT = new Intl.DateTimeFormat('ar-EG', { month: 'long', timeZone: 'UTC' });
const TWO_MONTHS = 2;

interface CompleteDateRange {
  readonly from: string;
  readonly to: string;
}

export function isDateRangeValid(range: DateRange): range is CompleteDateRange {
  return !!range.from && !!range.to && range.from <= range.to;
}

function monthNameOf(day: string): string {
  return MONTH_NAME_FORMAT.format(new Date(`${day}T00:00:00Z`));
}

function countMonthsSpanned(range: CompleteDateRange): number {
  const [fromYear, fromMonth] = range.from.split('-').map(Number);
  const [toYear, toMonth] = range.to.split('-').map(Number);
  return (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;
}

function describeMonths(range: CompleteDateRange): string {
  const firstMonth = monthNameOf(range.from);
  const lastMonth = monthNameOf(range.to);
  const monthCount = countMonthsSpanned(range);
  if (monthCount === 1) {
    return `في شهر ${firstMonth}`;
  }
  if (monthCount === TWO_MONTHS) {
    return `في شهر ${firstMonth} و${lastMonth}`;
  }
  return `من شهر ${firstMonth} إلى شهر ${lastMonth}`;
}

/** The hint under the custom range: "تم تحديد فترة 33 يوماً في شهر أغسطس وسبتمبر". */
export function describeDateRange(range: DateRange): string | null {
  if (!isDateRangeValid(range)) {
    return null;
  }
  const length = formatArabicCount(countCalendarDays(range.from, range.to), DAY_WORDS);
  return `تم تحديد فترة ${length} ${describeMonths(range)}`;
}
