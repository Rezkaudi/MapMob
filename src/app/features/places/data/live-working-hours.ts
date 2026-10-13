import { WorkingHoursRow } from '../models/working-hours-row';
import { LiveWorkingDay } from './live-place-detail';

// The server numbers days like JavaScript: 0 is Sunday.
const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const TODAY_NOTE = ' (اليوم)';

export function toWorkingHoursRows(
  days: readonly LiveWorkingDay[],
  now: Date,
): readonly WorkingHoursRow[] {
  return days
    .filter((day) => day.isOpen && day.openTime && day.closeTime)
    .map((day) => {
      const isToday = day.day === now.getDay();
      return {
        days: `${DAY_NAMES[day.day]}${isToday ? TODAY_NOTE : ''}`,
        hours: `${day.openTime} - ${day.closeTime}`,
        isToday,
      };
    });
}
