import { formatArabicTwelveHourTime } from '../../../shared/formatting/twelve-hour-time';
import { StoreWorkingDay } from '../models/store-working-day';
import { WEEK_DAY_LABEL } from '../models/week-day';
import { WorkingDayRow } from '../models/working-day-row';

const NO_TIME = '';

function formatTime(time: string | null): string {
  return time ? formatArabicTwelveHourTime(time) : NO_TIME;
}

export function toWorkingDayRows(week: readonly StoreWorkingDay[]): WorkingDayRow[] {
  return week.map((one) => ({
    day: one.day,
    label: WEEK_DAY_LABEL[one.day],
    isOpen: one.isOpen,
    openTime: one.openTime ?? NO_TIME,
    closeTime: one.closeTime ?? NO_TIME,
    openTimeText: one.isOpen ? formatTime(one.openTime) : NO_TIME,
    closeTimeText: one.isOpen ? formatTime(one.closeTime) : NO_TIME,
  }));
}
