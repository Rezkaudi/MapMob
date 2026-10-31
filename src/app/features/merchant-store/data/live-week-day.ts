import { WEEK_DAY_LABEL, WeekDay } from '../models/week-day';

/** The server numbers days from 0 = Sunday. */
export const LIVE_WEEK_DAYS: readonly WeekDay[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/** Saturday first, as the hours card lists the week. */
export const PAGE_WEEK_DAYS = Object.keys(WEEK_DAY_LABEL) as readonly WeekDay[];

export function liveDayNumberOf(day: WeekDay): number {
  return LIVE_WEEK_DAYS.indexOf(day);
}
