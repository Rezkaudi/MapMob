/** Written out because `Intl` spells Monday "الاثنين" and the evening "م", unlike the design. */
const WEEKDAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MORNING_WORD = 'صباحاً';
const EVENING_WORD = 'مساءً';
const NOON_HOUR = 12;
const PADDED_LENGTH = 2;
const DAY_MONTH_YEAR_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** "الإثنين 01 سبتمبر 2026 - الساعة 08:42 مساءً", in the viewer's own time zone. */
export function formatArabicDateTime(moment: Date): string {
  const hours = moment.getHours();
  const clockHour = hours % NOON_HOUR || NOON_HOUR;
  const periodWord = hours < NOON_HOUR ? MORNING_WORD : EVENING_WORD;
  const day = `${WEEKDAY_NAMES[moment.getDay()]} ${DAY_MONTH_YEAR_FORMAT.format(moment)}`;
  return `${day} - الساعة ${pad(clockHour)}:${pad(moment.getMinutes())} ${periodWord}`;
}
