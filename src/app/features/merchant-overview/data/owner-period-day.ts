import { ChartPeriod } from '../../../shared/models/chart-period';

const DAY_MS = 86_400_000;
const DAYS_IN_WEEK = 7;
// ISO week 1 is the week that holds 4 January.
const FIRST_WEEK_DAY_OF_JANUARY = 4;

/** Turns an owner `periodStart` into the `yyyy-mm-dd` day the period starts on. */
export function ownerPeriodDay(periodStart: string, period: ChartPeriod): string {
  const [year, part = '1'] = periodStart.split('-');
  if (period === 'weekly') {
    return mondayOfIsoWeek(Number(year), Number(part));
  }
  return `${year}-${part.padStart(2, '0')}-01`;
}

function mondayOfIsoWeek(year: number, week: number): string {
  const fourthOfJanuary = Date.UTC(year, 0, FIRST_WEEK_DAY_OF_JANUARY);
  const daysSinceMonday = (new Date(fourthOfJanuary).getUTCDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
  const firstMonday = fourthOfJanuary - daysSinceMonday * DAY_MS;
  return new Date(firstMonday + (week - 1) * DAYS_IN_WEEK * DAY_MS).toISOString().slice(0, 10);
}
