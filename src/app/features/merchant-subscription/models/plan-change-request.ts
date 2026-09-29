import { BillingCycle } from '../../../shared/models/billing-cycle';
import { PlanChangeKind } from './plan-change-kind';

/** A request MapMob has not handled yet. The admin confirms the cash payment, then applies it. */
export interface PlanChangeRequest {
  readonly id: string;
  readonly kind: PlanChangeKind;
  readonly plan: { readonly id: string; readonly name: string };
  readonly term: BillingCycle;
  readonly status: 'pending';
  /** ISO moment. */
  readonly createdAt: string;
}
