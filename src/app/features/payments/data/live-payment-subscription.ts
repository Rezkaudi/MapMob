import { LivePlan } from '../../../shared/data/live-plan';

/** One row of `GET /admin/subscriptions`, as the payment screens read it. */
export interface LivePaymentSubscription {
  readonly id: number;
  readonly store: { readonly id: number; readonly name: string };
  readonly plan: LivePlan;
  readonly starts_at: string;
  readonly ends_at: string;
  readonly status: string;
}
