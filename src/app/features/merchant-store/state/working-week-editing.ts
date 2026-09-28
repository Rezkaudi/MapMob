import { StoreWorkingDay } from '../models/store-working-day';
import { WeekDay } from '../models/week-day';

/** The hours the design shows on every open day. */
const DEFAULT_OPEN_TIME = '09:00';
const DEFAULT_CLOSE_TIME = '23:00';

export type DayTimeField = 'openTime' | 'closeTime';
type Week = readonly StoreWorkingDay[];

function patchDay(week: Week, day: WeekDay, patch: Partial<StoreWorkingDay>): StoreWorkingDay[] {
  return week.map((one) => (one.day === day ? { ...one, ...patch } : one));
}

export function openDay(week: Week, day: WeekDay): StoreWorkingDay[] {
  const current = week.find((one) => one.day === day);
  return patchDay(week, day, {
    isOpen: true,
    openTime: current?.openTime ?? DEFAULT_OPEN_TIME,
    closeTime: current?.closeTime ?? DEFAULT_CLOSE_TIME,
  });
}

/** Keeps the hours, so opening the day again brings them back. */
export function closeDay(week: Week, day: WeekDay): StoreWorkingDay[] {
  return patchDay(week, day, { isOpen: false });
}

export function setDayTime(
  week: Week,
  day: WeekDay,
  field: DayTimeField,
  time: string,
): StoreWorkingDay[] {
  return patchDay(week, day, { [field]: time });
}

export function toSavedWeek(week: Week): StoreWorkingDay[] {
  return week.map((one) => (one.isOpen ? one : { ...one, openTime: null, closeTime: null }));
}
