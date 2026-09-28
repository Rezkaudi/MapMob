export type WeekDay =
  'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

/** Saturday first, as the hours card lists the week. */
export const WEEK_DAY_LABEL: Readonly<Record<WeekDay, string>> = {
  saturday: 'السبت',
  sunday: 'الأحد',
  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
};
