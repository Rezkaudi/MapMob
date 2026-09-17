import { toSendDate } from './send-moment';

const NOON_HOUR = 12;
const PADDED_LENGTH = 2;
const MORNING_WORD = 'صباحاً';
const EVENING_WORD = 'مساءً';
const MONTH_FORMAT = new Intl.DateTimeFormat('ar-EG', { month: 'long' });

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** "10 سبتمبر 2026- 10:00 صباحاً", with Latin digits as the design writes it. */
export function formatSendTime(sendAt: string): string {
  const moment = toSendDate(sendAt);
  const hours = moment.getHours();
  const clockHour = hours % NOON_HOUR || NOON_HOUR;
  const periodWord = hours < NOON_HOUR ? MORNING_WORD : EVENING_WORD;
  const day = `${moment.getDate()} ${MONTH_FORMAT.format(moment)} ${moment.getFullYear()}`;
  return `${day}- ${pad(clockHour)}:${pad(moment.getMinutes())} ${periodWord}`;
}
