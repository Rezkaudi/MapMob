import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { DateRange } from '../models/date-range';
import { RegistrationPeriod } from '../models/registration-period';
import { UserFilters } from '../models/user-filters';

type PresetPeriod = Exclude<RegistrationPeriod, 'all' | 'custom'>;

/** How many days back each preset starts, counting today as one of them. */
const PRESET_DAYS_BACK: Record<PresetPeriod, number> = {
  today: 0,
  last7Days: 6,
  last30Days: 29,
};

const OPEN_RANGE: DateRange = { from: null, to: null };

export function resolveRegistrationRange(filters: UserFilters, today: Date): DateRange {
  const period = filters.registrationPeriod;
  if (period === 'all') {
    return OPEN_RANGE;
  }
  if (period === 'custom') {
    return filters.customRange;
  }
  const lastDay = toCalendarDay(today);
  return { from: addCalendarDays(lastDay, -PRESET_DAYS_BACK[period]), to: lastDay };
}
