import { PaymentTerm } from '../models/payment-term';

/** The dates the dialog fills in under "فترة سريان الاشتراك المحسوبة تلقائياً". */
export interface SubscriptionWindow {
  readonly startsOn: string;
  readonly endsOn: string;
}

const MONTHS_PER_TERM: Record<PaymentTerm, number> = { monthly: 1, yearly: 12 };
const LAST_MONTH_INDEX = 11;

export function buildSubscriptionWindow(startsOn: string, term: PaymentTerm): SubscriptionWindow {
  const [year, month, day] = startsOn.split('-').map(Number);
  const monthsFromStart = month - 1 + MONTHS_PER_TERM[term];
  const endYear = year + Math.floor(monthsFromStart / (LAST_MONTH_INDEX + 1));
  const endMonth = monthsFromStart % (LAST_MONTH_INDEX + 1);
  const endDay = Math.min(day, daysInMonth(endYear, endMonth));
  return { startsOn, endsOn: writeDay(endYear, endMonth + 1, endDay) };
}

/** Day 0 of the month after is the last day of the month asked for. */
function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function writeDay(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
