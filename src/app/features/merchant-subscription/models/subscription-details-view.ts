import { StatusCopy } from './status-copy';

/** The "تفاصيل الاشتراك" dialog. */
export interface SubscriptionDetailsView {
  readonly planName: string;
  readonly status: StatusCopy;
  readonly startsOnText: string;
  readonly endsOnText: string;
  readonly amountText: string;
  readonly termLabel: string;
  readonly paymentMethodText: string;
  readonly features: readonly string[];
}
