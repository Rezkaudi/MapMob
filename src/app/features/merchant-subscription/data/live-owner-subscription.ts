import { LiveOwnerPlan } from './live-owner-plan';

/** `current` and each `history` row of GET /owner/subscription. */
export interface LiveOwnerSubscription {
  readonly id: string;
  readonly plan: LiveOwnerPlan;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly status: string;
  readonly paymentMethod: string | null;
  readonly amountPaid: number | null;
  readonly currencyCode: string;
}
