import { BillingCycle } from '../../../shared/models/billing-cycle';

export interface PlanPrice {
  readonly amount: number;
  readonly term: BillingCycle;
}
