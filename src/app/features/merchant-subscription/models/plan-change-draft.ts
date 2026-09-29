import { BillingCycle } from '../../../shared/models/billing-cycle';
import { PlanChangeKind } from './plan-change-kind';

/** What the three request dialogs send. */
export interface PlanChangeDraft {
  readonly kind: PlanChangeKind;
  readonly planId: string;
  readonly term: BillingCycle;
}
