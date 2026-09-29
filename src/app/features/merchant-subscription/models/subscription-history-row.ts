import { StatusCopy } from './status-copy';
import { SubscriptionRecord } from './subscription-record';

/** One row of "سجل الاشتراكات". */
export interface SubscriptionHistoryRow {
  readonly record: SubscriptionRecord;
  readonly planName: string;
  readonly termLabel: string;
  readonly amountText: string;
  readonly startsOnText: string;
  readonly endsOnText: string;
  readonly status: StatusCopy;
}
