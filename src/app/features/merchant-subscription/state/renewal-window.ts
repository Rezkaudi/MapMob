import { countCalendarDays } from '../../../shared/formatting/calendar-day';
import { SubscriptionRecord } from '../models/subscription-record';

const RENEWAL_WINDOW_DAYS = 7;

/** A period can be renewed in its last week, and any time after it ran out. */
export function isRenewalDue(record: SubscriptionRecord, today: string): boolean {
  if (record.status === 'expired') {
    return true;
  }
  const daysLeft = countCalendarDays(today, record.endsOn) - 1;
  return daysLeft <= RENEWAL_WINDOW_DAYS;
}
