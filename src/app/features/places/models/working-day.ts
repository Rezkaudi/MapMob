export interface WorkingDay {
  readonly day: string;
  readonly isOpen: boolean;
  readonly opensAt: string;
  readonly closesAt: string;
}

const DEFAULT_OPENS_AT = '09:00';
const DEFAULT_CLOSES_AT = '18:00';
const WEEK_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
] as const;

/** The week as the form starts it: Sunday to Thursday open, weekend closed. */
export function createDefaultWeek(): WorkingDay[] {
  return WEEK_DAYS.map((day) => ({
    day,
    isOpen: day !== 'السبت' && day !== 'الجمعة',
    opensAt: DEFAULT_OPENS_AT,
    closesAt: DEFAULT_CLOSES_AT,
  }));
}
