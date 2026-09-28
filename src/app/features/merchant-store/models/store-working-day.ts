import { WeekDay } from './week-day';

/** Times are `HH:mm`; the API sends `null` for both on a closed day. */
export interface StoreWorkingDay {
  readonly day: WeekDay;
  readonly isOpen: boolean;
  readonly openTime: string | null;
  readonly closeTime: string | null;
}
