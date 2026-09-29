import { PlanTier } from '../../../shared/models/plan-tier';
import { SubscriptionStatus } from '../../../shared/models/subscription-status';

/** One row of the "سجل الاشتراكات" table. */
export interface Subscription {
  readonly id: string;
  readonly companyName: string;
  readonly planName: string;
  readonly planTier: PlanTier;
  readonly price: number;
  readonly currencySymbol: string;
  /** `yyyy-mm-dd`. */
  readonly startedOn: string;
  readonly endsOn: string;
  readonly status: SubscriptionStatus;
}
