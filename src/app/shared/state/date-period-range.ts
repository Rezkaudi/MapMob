import { addCalendarDays, toCalendarDay } from '../formatting/calendar-day';
import { DatePeriod } from '../models/date-period';
import { DateRange } from '../models/date-range';

type PresetPeriod = Exclude<DatePeriod, 'all' | 'custom'>;

/** How many days back each preset starts, counting today as one of them. */
const PRESET_DAYS_BACK: Record<PresetPeriod, number> = {
  today: 0,
  last7Days: 6,
  last30Days: 29,
};

const OPEN_RANGE: DateRange = { from: null, to: null };

export function resolveDatePeriodRange(
  period: DatePeriod,
  customRange: DateRange,
  today: Date,
): DateRange {
  if (period === 'all') {
    return OPEN_RANGE;
  }
  if (period === 'custom') {
    return customRange;
  }
  const lastDay = toCalendarDay(today);
  return { from: addCalendarDays(lastDay, -PRESET_DAYS_BACK[period]), to: lastDay };
}
