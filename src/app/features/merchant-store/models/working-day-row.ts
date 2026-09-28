import { WeekDay } from './week-day';

/** One line of the hours card, ready to show. */
export interface WorkingDayRow {
  readonly day: WeekDay;
  readonly label: string;
  readonly isOpen: boolean;
  readonly openTime: string;
  readonly closeTime: string;
  readonly openTimeText: string;
  readonly closeTimeText: string;
}
